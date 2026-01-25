import { View, ToolbarProps } from "react-big-calendar";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";

export default function CalendarToolbar(props: ToolbarProps<any>) {
  const { date, view, views, label, onView, onNavigate, localizer } = props;

  const navigate = (action: "PREV" | "NEXT" | "TODAY") => {
    onNavigate(action);
  };

  const currentView = view;
  const availableViews = views as View[];

  // Shared button styles
  const btnBase =
    "relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-semibold text-gray-950 hover:bg-gray-50 focus:z-10 focus:outline-none transition-colors";
  const btnFirst = "rounded-l-md";
  const btnLast = "rounded-r-md";
  const btnMiddle = "-ml-px";
  const btnActive =
    "bg-blue-600 text-white border-blue-600 hover:bg-blue-700 z-20";

  return (
    <div className="rbc-toolbar flex flex-col gap-4 mb-4 border-b border-gray-200 pb-4">
      {/* Mobile Layout: Row 1 (Nav + View), Row 2 (Label) */}
      <div className="md:hidden flex flex-col gap-4">
        <div className="flex items-center justify-between gap-2 w-full">
          {/* Navigation Group - Separated Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="px-4 h-10 bg-white text-sm font-bold text-gray-900 hover:bg-gray-50 focus:z-10 focus:outline-none border border-gray-300 rounded-md shadow-sm transition-colors flex items-center justify-center"
              onClick={() => navigate("TODAY")}
            >
              Today
            </button>
            <button
              type="button"
              className="w-10 h-10 flex items-center justify-center bg-white hover:bg-gray-50 focus:z-10 focus:outline-none border border-gray-300 rounded-md shadow-sm transition-colors"
              onClick={() => navigate("PREV")}
              aria-label="Previous range"
            >
              <ChevronLeft className="w-4 h-4 text-gray-900" />
            </button>
            <button
              type="button"
              className="w-10 h-10 flex items-center justify-center bg-white hover:bg-gray-50 focus:z-10 focus:outline-none border border-gray-300 rounded-md shadow-sm transition-colors"
              onClick={() => navigate("NEXT")}
              aria-label="Next range"
            >
              <ChevronRight className="w-4 h-4 text-gray-900" />
            </button>
          </div>

          {/* Mobile View Selector (Compact Horizontal) */}
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex flex-row items-center justify-center w-auto h-10 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none transition-all gap-2 px-3 min-w-[100px]">
                <ChevronDown className="w-4 h-4 text-gray-900" />
                <span className="capitalize text-sm font-bold text-gray-950">
                  {localizer.messages[currentView] || currentView}
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-[140px] border border-gray-200 rounded-md shadow-2xl bg-white p-1 overflow-hidden z-50 animate-in fade-in-80 zoom-in-95"
              >
                {availableViews.map((v) => (
                  <DropdownMenuItem
                    key={v}
                    onClick={() => onView(v)}
                    className={`
                    cursor-pointer px-3 py-2 font-bold capitalize rounded-sm text-sm
                    focus:bg-blue-50 focus:text-blue-700
                    ${currentView === v ? "bg-blue-50 text-blue-700" : "text-gray-700"}
                  `}
                  >
                    {localizer.messages[v] || v}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Label (Mobile) */}
        <h2
          className="text-center font-bold text-lg text-gray-900 uppercase tracking-tight"
          aria-live="polite"
        >
          {label}
        </h2>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex items-center justify-between w-full">
        {/* Navigation Group */}
        <div className="rbc-btn-group isolate inline-flex rounded-md shadow-sm">
          <button
            type="button"
            className={`${btnBase} ${btnFirst}`}
            onClick={() => navigate("TODAY")}
          >
            Today
          </button>
          <button
            type="button"
            className={`${btnBase} ${btnMiddle} px-2`}
            onClick={() => navigate("PREV")}
            aria-label="Previous range"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            className={`${btnBase} ${btnLast} ${btnMiddle} px-2`}
            onClick={() => navigate("NEXT")}
            aria-label="Next range"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Label (Desktop) */}
        <h2
          className="rbc-toolbar-label font-bold text-xl text-gray-900 uppercase tracking-tight"
          aria-live="polite"
        >
          {label}
        </h2>

        {/* View Selector Group (Desktop) */}
        <div className="isolate inline-flex rounded-md shadow-sm">
          {availableViews.map((v, idx) => {
            const isFirst = idx === 0;
            const isLast = idx === availableViews.length - 1;
            const isActive = currentView === v;

            return (
              <button
                key={v}
                type="button"
                onClick={() => onView(v)}
                className={`
                  ${btnBase}
                  ${isFirst ? btnFirst : ""}
                  ${!isFirst ? btnMiddle : ""}
                  ${isLast ? btnLast : ""}
                  ${isActive ? btnActive : ""}
                `}
                aria-pressed={isActive}
              >
                {localizer.messages[v] ||
                  v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
