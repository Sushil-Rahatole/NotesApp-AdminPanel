import { useForm } from "react-hook-form";
import { apiRequest } from "@/lib/queryClient";
import { useState } from "react";

type SemesterFormData = {
  semester: string;
};

export default function SemesterDialog() {
  const { register, handleSubmit, reset } = useForm<SemesterFormData>();
  const [status, setStatus] = useState<string | null>(null);

  const onSubmit = async (data: SemesterFormData) => {
    try {
      await apiRequest("POST", "/api/insertSemester", data);
      setStatus("Semester added successfully.");
      reset();
    } catch (err: any) {
      setStatus("Error: " + err.message);
    }
  };

  return (
    <div className="p-4 border rounded max-w-md">
      <h2 className="text-xl font-semibold mb-2">Add Semester</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          className="border p-2 w-full"
          placeholder="Semester name or number"
          {...register("semester", { required: true })}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Submit
        </button>
        {status && <p className="text-sm mt-2">{status}</p>}
      </form>
    </div>
  );
}
