import {
  Users,
  Video,
  Eye,
  MessageSquare,
} from "lucide-react";

export default function DashboardPage() {
  const stats = [
    {
      title: "Total Users",
      value: "1,250",
      icon: Users,
    },
    {
      title: "Total Videos",
      value: "340",
      icon: Video,
    },
    {
      title: "Total Views",
      value: "85.2K",
      icon: Eye,
    },
    {
      title: "Feedback",
      value: "52",
      icon: MessageSquare,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold">
          Dashboard
        </h1>

        <p className="text-muted-foreground">
          Welcome back Admin 👋
        </p>
      </div>

      {/* Stats */}
      <div
        className="
          grid
          gap-4

          grid-cols-1
          sm:grid-cols-2
          xl:grid-cols-4
        "
      >
        {stats.map((item) => (
          <div
            key={item.title}
            className="
              rounded-2xl

              border
              border-border

              bg-card

              p-5

              shadow-sm
            "
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {item.title}
                </p>

                <h2 className="mt-2 text-3xl font-bold">
                  {item.value}
                </h2>
              </div>

              <item.icon
                size={32}
                className="text-primary"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Recent Videos + Users */}
      <div
        className="
          grid
          gap-6

          lg:grid-cols-2
        "
      >
        {/* Recent Videos */}
        <div
          className="
            rounded-2xl

            border
            border-border

            bg-card

            p-5
          "
        >
          <h2 className="mb-4 text-xl font-semibold">
            Recent Videos
          </h2>

          <div className="space-y-3">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="
                  flex
                  items-center
                  justify-between

                  rounded-xl

                  bg-background

                  p-3
                "
              >
                <span>
                  Sample Video {item}
                </span>

                <span className="text-sm text-muted-foreground">
                  Published
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Users */}
        <div
          className="
            rounded-2xl

            border
            border-border

            bg-card

            p-5
          "
        >
          <h2 className="mb-4 text-xl font-semibold">
            Recent Users
          </h2>

          <div className="space-y-3">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="
                  flex
                  items-center
                  justify-between

                  rounded-xl

                  bg-background

                  p-3
                "
              >
                <span>
                  User {item}
                </span>

                <span className="text-sm text-muted-foreground">
                  Active
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}