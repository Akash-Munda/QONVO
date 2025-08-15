import { MessageSquare } from "lucide-react";

const NoChatSelected = () => {
  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-16 bg-base-100/50">
      <div className="max-w-md text-center space-y-6">
        {/* Icon Display */}
        <div className="flex justify-center gap-4 mb-4">
          <div className="relative">
            <div
              className="w-16 h-16 rounded-2xl  flex items-center
             justify-center animate-bounce"
            >
              {/* <MessageSquare className="w-8 h-8 text-primary " /> */}
              {/* <MessageSquare className="w-8 h-8 text-primary " /> */}{" "}
              <div
                className="w-16 h-16 flex items-center
             justify-center text-primary"
              >
                <svg
                  clsdassName="text-primary important"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 757 743"
                  width="757"
                  height="743"
                  fill="currentColor"
                >
                  <circle
                    cx="366.413"
                    cy="342.139"
                    r="250.731"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="111.458"
                    stroke-linecap="round"
                  />
                  <circle cx="620.872" cy="654.166" r="53.729" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Welcome Text */}
        <h2 className="text-2xl font-bold">Welcome to Qonvo!</h2>
        <p className="text-base-content/60">
          Select a conversation from the sidebar to start chatting
        </p>
      </div>
    </div>
  );
};

export default NoChatSelected;
