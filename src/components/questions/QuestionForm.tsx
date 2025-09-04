import type React from "react"
import { useState, useEffect } from "react"
import { X, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useCreateQuestion, useUpdateQuestion } from "@/api/mutations/questions"
import { useQuestionsQuery } from "@/api/queries/questions"
import type { QuizQuestion, CreateQuestionData, UpdateQuestionData } from "@/types/courses"

interface QuestionFormProps {
  lessonId: string
  question?: QuizQuestion | null
  onClose: () => void
  onSuccess: () => void
}

export const QuestionForm: React.FC<QuestionFormProps> = ({ lessonId, question, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    question: "",
    options: ["", "", "", ""],
    correctOptionIndex: 0,
    order: 1,
  })

  const { data: existingQuestions = [] } = useQuestionsQuery(lessonId)
  const createQuestionMutation = useCreateQuestion()
  const updateQuestionMutation = useUpdateQuestion()

  const isEditing = !!question

  useEffect(() => {
    if (question) {
      setFormData({
        question: question.question,
        options: [...question.options],
        correctOptionIndex: question.correctOptionIndex,
        order: question.order,
      })
    } else {
      // Set next order number for new questions
      const maxOrder = existingQuestions.reduce((max, q) => Math.max(max, q.order), 0)
      setFormData((prev) => ({ ...prev, order: maxOrder + 1 }))
    }
  }, [question, existingQuestions])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.question.trim() || formData.options.some((opt) => !opt.trim())) {
      return
    }

    try {
      if (isEditing && question) {
        const updateData: UpdateQuestionData = {
          question: formData.question,
          options: formData.options,
          correctOptionIndex: formData.correctOptionIndex,
          order: formData.order,
        }
        await updateQuestionMutation.mutateAsync({ id: question._id, data: updateData })
      } else {
        const createData: CreateQuestionData = {
          question: formData.question,
          options: formData.options,
          correctOptionIndex: formData.correctOptionIndex,
          order: formData.order,
        }
        await createQuestionMutation.mutateAsync({ lessonId, data: createData })
      }
      onSuccess()
    } catch (error) {
      console.error("Error saving question:", error)
    }
  }

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options]
    newOptions[index] = value
    setFormData((prev) => ({ ...prev, options: newOptions }))
  }

  const addOption = () => {
    if (formData.options.length < 6) {
      setFormData((prev) => ({ ...prev, options: [...prev.options, ""] }))
    }
  }

  const removeOption = (index: number) => {
    if (formData.options.length > 2) {
      const newOptions = formData.options.filter((_, i) => i !== index)
      setFormData((prev) => ({
        ...prev,
        options: newOptions,
        correctOptionIndex:
          prev.correctOptionIndex >= index && prev.correctOptionIndex > 0
            ? prev.correctOptionIndex - 1
            : prev.correctOptionIndex,
      }))
    }
  }

  const isLoading = createQuestionMutation.isPending || updateQuestionMutation.isPending
  const isValid = formData.question.trim() && formData.options.every((opt) => opt.trim())

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            {isEditing ? "Edit Question" : "Add New Question"}
            <Button variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0">
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="question">Question *</Label>
            <Textarea
              id="question"
              value={formData.question}
              onChange={(e) => setFormData((prev) => ({ ...prev, question: e.target.value }))}
              placeholder="Enter your question"
              rows={3}
              required
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Answer Options *</Label>
              {formData.options.length < 6 && (
                <Button type="button" variant="outline" size="sm" onClick={addOption}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Option
                </Button>
              )}
            </div>

            <RadioGroup
              value={formData.correctOptionIndex.toString()}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, correctOptionIndex: Number.parseInt(value) }))
              }
            >
              <div className="space-y-3">
                {formData.options.map((option, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="text-sm font-medium min-w-0">
                      {String.fromCharCode(65 + index)}.
                    </Label>
                    <Input
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      placeholder={`Option ${String.fromCharCode(65 + index)}`}
                      className="flex-1"
                      required
                    />
                    {formData.options.length > 2 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeOption(index)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </RadioGroup>
            <p className="text-sm text-gray-600">Select the correct answer by clicking the radio button next to it.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="order">Order</Label>
            <Input
              id="order"
              type="number"
              min="1"
              value={formData.order}
              onChange={(e) => setFormData((prev) => ({ ...prev, order: Number.parseInt(e.target.value) || 1 }))}
              placeholder="Question order"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !isValid}>
              {isLoading ? "Saving..." : isEditing ? "Update Question" : "Create Question"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
