import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useCourseProgress } from "@/contexts/CourseProgressContext";
import { FREE_LESSON_ID, getLessonForConcept } from "@/data/courseData";

const lessonLabel = (id: string) => `Lesson ${id.replace("-", ".")}`;

/* The Library-to-course link at the foot of a tactic page. It points at the
   lesson that teaches the tactic when the learner can open it, and says
   plainly where to start when they can't yet, rather than letting the
   lesson route silently redirect them somewhere else. */
export const PracticeThisLink = ({ slug }: { slug: string }) => {
  const { hasSession } = useAuth();
  const { isLessonUnlocked } = useCourseProgress();
  const lesson = getLessonForConcept(slug);

  if (!lesson) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">This one isn&apos;t in a lesson yet.</p>
        <Button asChild className="rounded-full h-11 px-6">
          <Link to="/train">
            <BookOpen className="w-4 h-4 mr-2" />
            Explore the course
          </Link>
        </Button>
      </div>
    );
  }

  if (isLessonUnlocked(lesson.id, hasSession)) {
    return (
      <Button asChild className="rounded-full h-11 px-6">
        <Link to={`/train/lesson/${lesson.id}`}>
          <BookOpen className="w-4 h-4 mr-2" />
          Practice this in {lessonLabel(lesson.id)}
        </Link>
      </Button>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        You&apos;ll practise this in {lessonLabel(lesson.id)}: {lesson.title}. Lessons unlock in order
        {hasSession ? "." : ", starting with Lesson 1, and you'll need a free account after that."}
      </p>
      <Button asChild className="rounded-full h-11 px-6">
        <Link to={hasSession ? "/train" : `/train/lesson/${FREE_LESSON_ID}`}>
          <BookOpen className="w-4 h-4 mr-2" />
          {hasSession ? "Go to the course" : "Start with Lesson 1"}
        </Link>
      </Button>
    </div>
  );
};
