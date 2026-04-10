import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { approveClaim, claimItem, rejectClaim } from "../api/claims";
import { getItemById } from "../api/items";
import Button from "../components/Button";
import Navbar from "../components/Navbar";
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
  createAt?: string;
  user?: {
    name?: string;
    email?: string;
  };
};

const getErrorMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      return "Your session has expired. Please log in again.";
    }

    if (typeof error.response?.data === "string") {
      return error.response.data;
    }

    return (
      error.response?.data?.error ??
      error.response?.data?.message ??
      "Request failed"
    );
  }

  return "Request failed";
};

export default function ItemDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const currentUserEmail = getCurrentUserEmail();
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimReference, setClaimReference] = useState("");
  const [claimActionLoading, setClaimActionLoading] = useState<"approve" | "reject" | null>(null);
  const [message, setMessage] = useState("");

  const { data: item, isLoading, refetch } = useQuery<Item>({
    queryKey: ["item", id],
    queryFn: () => getItemById(id as string),
    enabled: Boolean(id),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[linear-gradient(180deg,#fffef9_0%,#f8fafc_100%)]">
        <Navbar />
        <div className="mx-auto max-w-6xl px-6 py-12 text-slate-600">
          Loading item details...
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-[linear-gradient(180deg,#fffef9_0%,#f8fafc_100%)]">
        <Navbar />
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 text-slate-600 shadow-lg">
            Item not found.
          </div>
        </div>
      </div>
    );
  }

  const isOwner = item.user?.email === currentUserEmail;
  const isUnavailable = Boolean(item.claimed);

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fffef9_0%,#f8fafc_100%)]">
      <Navbar />
      <div className="mx-auto max-w-6xl px-6 py-10">
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-6 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
        >
          Back to Dashboard
        </button>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white shadow-xl shadow-slate-200/50">
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.title}
                className="h-[420px] w-full object-cover"
              />
            ) : (
              <div className="flex h-[420px] items-center justify-center bg-[linear-gradient(135deg,#fef3c7_0%,#e2e8f0_100%)] px-6 text-center text-slate-600">
                No image uploaded for this item
              </div>
            )}

            <div className="space-y-6 p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-2">
                  <span className="inline-flex rounded-full bg-amber-100 px-4 py-2 text-sm font-medium text-amber-800">
                    Item #{item.id}
                  </span>
                  <h1 className="text-3xl font-black tracking-tight text-slate-900">
                    {item.title}
                  </h1>
                  <p className="text-slate-500">
                    Posted by {isOwner ? "you" : item.user?.email ?? "unknown user"}
                  </p>
                </div>
                <span
                  className={`rounded-full px-4 py-2 text-sm font-semibold ${
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

              <p className="text-base leading-8 text-slate-600">
                {item.description}
              </p>

              <div className="flex flex-wrap gap-3 text-sm text-slate-600">
                {item.category ? (
                  <span className="rounded-full bg-slate-100 px-4 py-2">
                    Category: {item.category}
                  </span>
                ) : null}
                {item.location ? (
                  <span className="rounded-full bg-slate-100 px-4 py-2">
                    Location: {item.location}
                  </span>
                ) : null}
                {item.createAt ? (
                  <span className="rounded-full bg-slate-100 px-4 py-2">
                    Created: {new Date(item.createAt).toLocaleString()}
                  </span>
                ) : null}
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            {!isOwner ? (
              <div className="rounded-[2rem] border border-white/70 bg-white/90 p-7 shadow-2xl shadow-slate-200/60">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                  Claim This Item
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Send a claim request if this item belongs to you. The owner
                  will need your claim reference number to verify it.
                </p>

                {isUnavailable ? (
                  <div className="mt-4 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-medium text-slate-700">
                    This item has already been claimed and approved, so no new
                    claims can be submitted.
                  </div>
                ) : null}

                <Button
                  text={
                    isUnavailable
                      ? "Item Already Claimed"
                      : isClaiming
                        ? "Sending claim..."
                        : "Send Claim Request"
                  }
                  disabled={isClaiming || isUnavailable}
                  className="mt-6"
                  onClick={async () => {
                    try {
                      setIsClaiming(true);
                      const claim = await claimItem(item.id);
                      setMessage(
                        `Claim request sent. Your reference is #${claim.id} and the current status is ${claim.status}.`,
                      );
                    } catch (error) {
                      alert(getErrorMessage(error));
                    } finally {
                      setIsClaiming(false);
                    }
                  }}
                />
              </div>
            ) : (
              <div className="rounded-[2rem] border border-white/70 bg-white/90 p-7 shadow-2xl shadow-slate-200/60">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                  Verify Claim
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Enter the claim reference ID shared by the claimant to approve
                  or reject it.
                </p>

                <label className="mt-5 flex flex-col gap-2">
                  <span className="text-sm font-medium text-slate-700">
                    Claim Reference ID
                  </span>
                  <input
                    type="number"
                    min="1"
                    value={claimReference}
                    onChange={(event) => setClaimReference(event.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
                    placeholder="Enter claim ID"
                  />
                </label>

                <div className="mt-5 flex gap-3">
                  <button
                    type="button"
                    disabled={!claimReference.trim() || claimActionLoading !== null}
                    onClick={async () => {
                      try {
                        setClaimActionLoading("approve");
                        const claim = await approveClaim(Number(claimReference));
                        setMessage(
                          `Claim #${claim.id} approved. This item is now marked as claimed and further claims are blocked.`,
                        );
                        await refetch();
                      } catch (error) {
                        alert(getErrorMessage(error));
                      } finally {
                        setClaimActionLoading(null);
                      }
                    }}
                    className="flex-1 rounded-2xl bg-emerald-500 px-4 py-3 font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    {claimActionLoading === "approve" ? "Approving..." : "Approve Claim"}
                  </button>
                  <button
                    type="button"
                    disabled={!claimReference.trim() || claimActionLoading !== null}
                    onClick={async () => {
                      try {
                        setClaimActionLoading("reject");
                        const claim = await rejectClaim(Number(claimReference));
                        setMessage(
                          `Claim #${claim.id} rejected. Current status: ${claim.status}.`,
                        );
                        await refetch();
                      } catch (error) {
                        alert(getErrorMessage(error));
                      } finally {
                        setClaimActionLoading(null);
                      }
                    }}
                    className="flex-1 rounded-2xl bg-rose-500 px-4 py-3 font-semibold text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    {claimActionLoading === "reject" ? "Rejecting..." : "Reject Claim"}
                  </button>
                </div>
              </div>
            )}

            {message ? (
              <div className="rounded-[2rem] border border-amber-100 bg-amber-50 px-5 py-4 text-sm leading-7 text-amber-900">
                {message}
              </div>
            ) : null}
          </aside>
        </div>
      </div>
    </div>
  );
}
