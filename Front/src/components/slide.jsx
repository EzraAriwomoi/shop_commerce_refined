// import { Button } from "@/components/ui/button";
import "../css/slide.css"; // Assuming you have a Component.css file for styling

export default function Component() {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="flex items-center gap-2">
        <button  size="icon" disabled>
          <ChevronLeftIcon className="h-4" />
        </button>
        <button  size="icon" className="bg-primary text-primary-foreground">
          1
        </button>
        <button size="icon">
          2
        </button>
        <button size="icon">
          3
        </button>
        <button  size="icon">
          4
        </button>
        <button size="icon">
          5
        </button>
        <button  size="icon">
          <ChevronRightIcon className="h-4" />
        </button>
      </div>
    </div>
  );
}

function ChevronLeftIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
