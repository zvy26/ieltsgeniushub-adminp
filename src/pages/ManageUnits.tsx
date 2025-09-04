import type React from "react"
import { useState } from "react"
import { useParams } from "react-router-dom"
import { Plus, Edit, Trash2, ChevronDown, ChevronRight, BookOpen, FileText, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { UnitForm } from "@/components/units/UnitForm"
import { SectionForm } from "@/components/sections/SectionForm"
import { QuestionForm } from "@/components/questions/QuestionForm"
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
import { useUnitsQuery } from "@/api/queries/units"
import { useSectionsQuery } from "@/api/queries/sections"
import { useQuestionsQuery } from "@/api/queries/questions"
import { useDeleteUnit } from "@/api/mutations/units"
import { useDeleteSection } from "@/api/mutations/sections"
import { useDeleteQuestion } from "@/api/mutations/questions"
import type { Unit, Section, QuizQuestion } from "@/types/courses"

export const ManageUnits: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>()
  const [expandedUnits, setExpandedUnits] = useState<Set<number>>(new Set())
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set())
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null)
  const [editingSection, setEditingSection] = useState<Section | null>(null)
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(null)
  const [showUnitForm, setShowUnitForm] = useState(false)
  const [showSectionForm, setShowSectionForm] = useState<number | null>(null)
  const [showQuestionForm, setShowQuestionForm] = useState<number | null>(null)

  const { toast } = useToast()
  const { data: units = [], isLoading } = useUnitsQuery(courseId || "")
  const deleteUnitMutation = useDeleteUnit()
  const deleteSectionMutation = useDeleteSection()
  const deleteQuestionMutation = useDeleteQuestion()

  const toggleUnit = (unitId: number) => {
    const newExpanded = new Set(expandedUnits)
    if (newExpanded.has(unitId)) {
      newExpanded.delete(unitId)
    } else {
      newExpanded.add(unitId)
    }
    setExpandedUnits(newExpanded)
  }

  const toggleSection = (sectionId: number) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId)
    } else {
      newExpanded.add(sectionId)
    }
    setExpandedSections(newExpanded)
  }

  const handleDeleteUnit = async (unit: Unit) => {
    try {
      await deleteUnitMutation.mutateAsync(unit.id)
      toast({
        title: "Success",
        description: "Unit deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete unit",
        variant: "destructive",
      })
    }
  }

  const handleDeleteSection = async (section: Section) => {
    try {
      await deleteSectionMutation.mutateAsync(section.id)
      toast({
        title: "Success",
        description: "Section deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete section",
        variant: "destructive",
      })
    }
  }

  const handleDeleteQuestion = async (question: QuizQuestion) => {
    try {
      await deleteQuestionMutation.mutateAsync(question.id)
      toast({
        title: "Success",
        description: "Question deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete question",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!courseId) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No course selected</h3>
          <p className="text-gray-500">Please select a course to manage its units.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Units</h1>
          <p className="text-gray-600 mt-1">Create and manage units, sections, and questions</p>
        </div>
        <Button onClick={() => setShowUnitForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Unit
        </Button>
      </div>

      {units.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No units found</h3>
            <p className="text-gray-500 text-center mb-4">Get started by creating your first unit</p>
            <Button onClick={() => setShowUnitForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Unit
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {units.map((unit) => (
            <UnitCard
              key={unit.id}
              unit={unit}
              isExpanded={expandedUnits.has(unit.id)}
              onToggle={() => toggleUnit(unit.id)}
              onEdit={() => setEditingUnit(unit)}
              onDelete={() => handleDeleteUnit(unit)}
              onAddSection={() => setShowSectionForm(unit.id)}
              expandedSections={expandedSections}
              onToggleSection={toggleSection}
              onEditSection={setEditingSection}
              onDeleteSection={handleDeleteSection}
              onAddQuestion={setShowQuestionForm}
              onEditQuestion={setEditingQuestion}
              onDeleteQuestion={handleDeleteQuestion}
            />
          ))}
        </div>
      )}

      {/* Unit Form Modal */}
      {(showUnitForm || editingUnit) && (
        <UnitForm
          unit={editingUnit}
          onClose={() => {
            setShowUnitForm(false)
            setEditingUnit(null)
          }}
        />
      )}

      {/* Section Form Modal */}
      {(showSectionForm || editingSection) && (
        <SectionForm
          section={editingSection}
          unitId={showSectionForm || editingSection?.unitId}
          onClose={() => {
            setShowSectionForm(null)
            setEditingSection(null)
          }}
        />
      )}

      {/* Question Form Modal */}
      {(showQuestionForm || editingQuestion) && (
        <QuestionForm
          question={editingQuestion}
          lessonId={showQuestionForm || editingQuestion?.lessonId}
          onClose={() => {
            setShowQuestionForm(null)
            setEditingQuestion(null)
          }}
        />
      )}
    </div>
  )
}

interface UnitCardProps {
  unit: Unit
  isExpanded: boolean
  onToggle: () => void
  onEdit: () => void
  onDelete: () => void
  onAddSection: () => void
  expandedSections: Set<number>
  onToggleSection: (sectionId: number) => void
  onEditSection: (section: Section) => void
  onDeleteSection: (section: Section) => void
  onAddQuestion: (sectionId: number) => void
  onEditQuestion: (question: QuizQuestion) => void
  onDeleteQuestion: (question: QuizQuestion) => void
}

const UnitCard: React.FC<UnitCardProps> = ({
  unit,
  isExpanded,
  onToggle,
  onEdit,
  onDelete,
  onAddSection,
  expandedSections,
  onToggleSection,
  onEditSection,
  onDeleteSection,
  onAddQuestion,
  onEditQuestion,
  onDeleteQuestion,
}) => {
  const { data: sections = [] } = useSectionsQuery(unit.id.toString())

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onToggle} className="p-1 h-8 w-8">
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
            <div>
              <CardTitle className="text-lg">{unit.title}</CardTitle>
              {unit.description && <p className="text-sm text-gray-600 mt-1">{unit.description}</p>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {sections.length} section{sections.length !== 1 ? "s" : ""}
            </Badge>
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit className="h-4 w-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Unit</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete "{unit.title}"? This action cannot be undone and will also delete
                    all sections and questions within this unit.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={onDelete} className="bg-red-600 hover:bg-red-700">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900">Sections</h4>
            <Button variant="outline" size="sm" onClick={onAddSection}>
              <Plus className="h-4 w-4 mr-2" />
              Add Section
            </Button>
          </div>

          {sections.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p>No sections in this unit</p>
              <Button variant="outline" size="sm" onClick={onAddSection} className="mt-2 bg-transparent">
                Add First Section
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {sections.map((section) => (
                <SectionCard
                  key={section.id}
                  section={section}
                  isExpanded={expandedSections.has(section.id)}
                  onToggle={() => onToggleSection(section.id)}
                  onEdit={() => onEditSection(section)}
                  onDelete={() => onDeleteSection(section)}
                  onAddQuestion={() => onAddQuestion(section.id)}
                  onEditQuestion={onEditQuestion}
                  onDeleteQuestion={onDeleteQuestion}
                />
              ))}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )
}

interface SectionCardProps {
  section: Section
  isExpanded: boolean
  onToggle: () => void
  onEdit: () => void
  onDelete: () => void
  onAddQuestion: () => void
  onEditQuestion: (question: QuizQuestion) => void
  onDeleteQuestion: (question: QuizQuestion) => void
}

const SectionCard: React.FC<SectionCardProps> = ({
  section,
  isExpanded,
  onToggle,
  onEdit,
  onDelete,
  onAddQuestion,
  onEditQuestion,
  onDeleteQuestion,
}) => {
  const { data: questions = [] } = useQuestionsQuery(section.id.toString())

  return (
    <div className="border rounded-lg bg-gray-50">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onToggle} className="p-1 h-6 w-6">
              {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            </Button>
            <div>
              <h5 className="font-medium">{section.title}</h5>
              {section.description && <p className="text-sm text-gray-600">{section.description}</p>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {questions.length} question{questions.length !== 1 ? "s" : ""}
            </Badge>
            <Button variant="ghost" size="sm" onClick={onEdit}>
              <Edit className="h-3 w-3" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Section</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete "{section.title}"? This will also delete all questions in this
                    section.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={onDelete} className="bg-red-600 hover:bg-red-700">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-4 pl-6">
            <div className="flex items-center justify-between mb-3">
              <h6 className="text-sm font-medium text-gray-700">Questions</h6>
              <Button variant="outline" size="sm" onClick={onAddQuestion}>
                <Plus className="h-3 w-3 mr-1" />
                Add Question
              </Button>
            </div>

            {questions.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                <HelpCircle className="h-6 w-6 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">No questions in this section</p>
                <Button variant="outline" size="sm" onClick={onAddQuestion} className="mt-2 bg-transparent">
                  Add First Question
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {questions.map((question, index) => (
                  <div key={question.id} className="flex items-center justify-between p-3 bg-white rounded border">
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {index + 1}. {question.question}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {question.type}
                        </Badge>
                        <span className="text-xs text-gray-500">{question.options?.length || 0} options</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" onClick={() => onEditQuestion(question)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-3 w-3" />
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
                              onClick={() => onDeleteQuestion(question)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}