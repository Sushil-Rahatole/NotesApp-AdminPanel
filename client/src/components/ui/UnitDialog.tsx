import { useForm } from "react-hook-form";
import { apiRequest } from "@/lib/queryClient";
import { useState } from "react";

type UnitFormData = {
  semester: string;
  subject: string;
  unit: string;
};

export default function UnitDialog() {
  const { register, handleSubmit, reset } = useForm<UnitFormData>();
  const [status, setStatus] = useState<string | null>(null);

  const onSubmit = async (data: UnitFormData) => {
    try {
      await apiRequest("POST", "/api/insertUnitAndAppend", data);
      setStatus("Unit added successfully.");
      reset();
    } catch (err: any) {
      setStatus("Error: " + err.message);
    }
  };

  return (
    <div className="p-4 border rounded max-w-md">
      <h2 className="text-xl font-semibold mb-2">Add Unit</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          className="border p-2 w-full"
          placeholder="Semester"
          {...register("semester", { required: true })}
        />
        <input
          className="border p-2 w-full"
          placeholder="Subject"
          {...register("subject", { required: true })}
        />
        <input
          className="border p-2 w-full"
          placeholder="Unit"
          {...register("unit", { required: true })}
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Submit
        </button>
        {status && <p className="text-sm mt-2">{status}</p>}
      </form>
    </div>
  );
}
