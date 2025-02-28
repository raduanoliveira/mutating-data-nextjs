import { useActionState } from "react";
import FormSubmit from "./form-submit";

export default function PostForm() {
    const [state, formAction] = useActionState(createPost, {})

    return (
        <>
            <h1>Create a new post</h1>
            <form action={formAction}>
                <p className="form-control">
                    <label htmlFor="title">Title</label>
                    <input type="text" id="title" name="title" required />
                </p>
                <p className="form-control">
                    <label htmlFor="image">Image URL</label>
                    <input
                        type="file"
                        accept="image/png, image/jpeg"
                        id="image"
                        name="image"
                    />
                </p>
                <p className="form-control">
                    <label htmlFor="content">Content</label>
                    <textarea id="content" name="content" rows="5" />
                </p>
                <p className="form-actions">
                    <FormSubmit />
                </p>
            </form>
        </>
    );
}