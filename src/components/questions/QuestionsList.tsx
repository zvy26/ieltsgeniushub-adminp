import type React from "react"
import { useState } from "react"
import { Plus, Edit, Trash2, HelpCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useQuestionsQuery } from "@/api/queries/questions"
import { useDeleteQuestion } from "@/api/mutations/questions"
import type { QuizQuestion } from "@/types/courses"
import { QuestionForm } from "./QuestionForm"
import { toast } from "sonner"

interface QuestionsListProps {
  lessonId: string
  lessonTitle: string
}

export const QuestionsList: React.FC<QuestionsListProps> = ({ lessonId, lessonTitle }) => {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(null)

  const { data: questions = [], isLoading, error } = useQuestionsQuery(lessonId)
  const deleteQuestionMutation = useDeleteQuestion()

  const handleEdit = (question: QuizQuestion) => {
    setEditingQuestion(question)
    setIsFormOpen(true)
  }

  const handleDelete = async (question: QuizQuestion) => {
    try {
      await deleteQuestionMutation.mutateAsync({ id: question._id, lessonId })
      toast.success("Question deleted successfully")
    } catch (error) {
      toast.error("Failed to delete question")
    }
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
    setEditingQuestion(null)
  }

  const handleFormSuccess = () => {
    handleFormClose()
    toast.success(editingQuestion ? "Question updated successfully" : "Question created successfully")
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-600">Error loading questions: {error.message}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quiz Questions</h1>
          <p className="text-gray-600 mt-1">{lessonTitle}</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Question
        </Button>
      </div>

      {questions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <HelpCircle className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No questions yet</h3>
            <p className="text-gray-600 text-center mb-4">Start building your quiz by adding the first question</p>
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Question
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {questions.map((question, index) => (
            <Card key={question._id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="text-xs">
                      Q{index + 1}
                    </Badge>
                    <CardTitle className="text-lg">Question {question.order}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(question)} className="h-8 w-8 p-0">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Question</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this question? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(question)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Question:</h4>
                    <p className="text-gray-700">{question.question}</p>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Options:</h4>
                    <div className="space-y-2">
                      {question.options.map((option, optionIndex) => (
                        <div
                          key={optionIndex}
                          className={`flex items-center gap-2 p-2 rounded-md ${
                            optionIndex === question.correctOptionIndex
                              ? "bg-green-50 border border-green-200"
                              : "bg-gray-50"
                          }`}
                        >
                          {optionIndex === question.correctOptionIndex && (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          )}
                          <span className="font-medium text-sm">{String.fromCharCode(65 + optionIndex)}.</span>
                          <span
                            className={optionIndex === question.correctOptionIndex ? "text-green-800" : "text-gray-700"}
                          >
                            {option}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="text-sm text-gray-500">Order: {question.order}</div>
                    <div className="text-sm text-green-600 font-medium">
                      Correct: {String.fromCharCode(65 + question.correctOptionIndex)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {isFormOpen && (
        <QuestionForm
          lessonId={lessonId}
          question={editingQuestion}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  )
}
