import { PostForm } from "@/components/admin/post-form";

export default function NewPostPage() {
  return (
    <div className="py-4 max-w-4xl">
      <h1 className="text-xl font-bold mb-6">New Post</h1>
      <PostForm mode="create" />
    </div>
  );
}
