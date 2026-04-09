import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { claimItem } from "../api/claims";
import { useItems } from "../hooks/useItems";
import { getCurrentUserEmail } from "../utils/getCurrentUser";

type Item = {
  id: number;
  title: string;
  description: string;
  category?: string;
  location?: string;
  status: string;
  claimed?: boolean;
  imageUrl?: string;
  user?: {
    email?: string;
  };
};

export default function Dashboard() {
  const currentUserEmail = getCurrentUserEmail();
  const [claimedItems, setClaimedItems] = useState<number[]>([]);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const { data, isLoading } = useItems();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[linear-gradient(180deg,#fffef9_0%,#f8fafc_100%)]">
        <Navbar />
        <div className="mx-auto max-w-6xl px-6 py-12 text-slate-600">
          Loading items...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fffef9_0%,#f8fafc_100%)]">
      <Navbar />
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8 flex flex-col gap-5 rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-xl shadow-slate-200/60 backdrop-blur md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl space-y-3">
            <span className="inline-flex rounded-full bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700">
              Dashboard
            </span>
            <h1 className="text-4xl font-black tracking-tight text-slate-900">
              Browse active lost and found reports.
            </h1>
            <p className="text-lg leading-8 text-slate-600">
              Open item details, send claim requests, and verify claim
              references for the reports you posted.
            </p>
          </div>

          <button
            onClick={() => navigate("/create")}
            className="rounded-full bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-800"
          >
            + Add Item
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {data?.content?.map((item: Item) => {
            const isOwner = item.user?.email === currentUserEmail;
            const isClaimed = claimedItems.includes(item.id);
            const isUnavailable = Boolean(item.claimed);

            return (
              <article
                key={item.id}
                className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white shadow-lg shadow-slate-200/50 transition hover:-translate-y-1 hover:shadow-xl"
              >
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="h-52 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-52 items-center justify-center bg-[linear-gradient(135deg,#fef3c7_0%,#e2e8f0_100%)] px-6 text-center text-sm font-medium text-slate-600">
                    No image added for this item
                  </div>
                )}

                <div className="space-y-4 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">
                        {item.title}
                      </h2>
                      <p className="mt-1 text-sm text-slate-500">
                        {item.category || "Uncategorized"}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        isUnavailable
                          ? "bg-slate-900 text-white"
                          : item.status === "FOUND"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {isUnavailable ? "CLAIMED" : item.status}
                    </span>
                  </div>

                  <p className="min-h-12 text-sm leading-6 text-slate-600">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                    {item.location ? (
                      <span className="rounded-full bg-slate-100 px-3 py-1">
                        {item.location}
                      </span>
                    ) : null}
                    {item.user?.email ? (
                      <span className="rounded-full bg-slate-100 px-3 py-1">
                        Posted by {isOwner ? "you" : item.user.email}
                      </span>
                    ) : null}
                  </div>

                  {isClaimed ? (
                    <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                      Claim requested. Open details to see your reference ID.
                    </div>
                  ) : null}

                  {isUnavailable ? (
                    <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-medium text-slate-700">
                      This item has already been approved for another claimant.
                    </div>
                  ) : null}

                  <button
                    onClick={() => navigate(`/items/${item.id}`)}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                  >
                    View details
                  </button>

                  {!isOwner ? (
                    <button
                      disabled={loadingId === item.id || isClaimed || isUnavailable}
                      onClick={async () => {
                        try {
                          setLoadingId(item.id);
                          const claim = await claimItem(item.id);
                          setClaimedItems((prev) => [...prev, item.id]);
                          alert(
                            `Claim request sent. Share claim reference #${claim.id} with the item owner.`,
                          );
                        } catch {
                          alert("Failed to claim");
                        } finally {
                          setLoadingId(null);
                        }
                      }}
                      className="w-full rounded-2xl bg-amber-400 px-4 py-3 font-semibold text-slate-900 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
                    >
                      {loadingId === item.id
                        ? "Claiming..."
                        : isUnavailable
                          ? "Already Claimed"
                        : isClaimed
                          ? "Claim Sent"
                          : "Claim this item"}
                    </button>
                  ) : (
                    <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-medium text-slate-600">
                      Open details to approve or reject a claim by reference ID.
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {data?.content?.length === 0 ? (
          <div className="mt-10 rounded-[2rem] border border-dashed border-slate-300 bg-white/80 p-10 text-center text-slate-500">
            No items yet. Add the first lost or found report.
          </div>
        ) : null}
      </div>
    </div>
  );
}
