import { ReviewForm } from "@/components/admin/review-form";

export default function NewReviewPage() {
  return (
    <div className="py-4 max-w-4xl">
      <h1 className="text-xl font-bold mb-6">New Review</h1>
      <ReviewForm mode="create" />
    </div>
  );
}
