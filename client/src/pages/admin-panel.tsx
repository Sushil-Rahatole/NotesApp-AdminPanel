import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GraduationCap, Plus, FileText, Bell, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrayInput } from "@/components/ui/array-input";
import { toast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { semesterFormSchema, unitFormSchema, type SemesterFormData, type UnitFormData } from "@/lib/validations";

export default function AdminPanel() {
  const [activeView, setActiveView] = useState<"semester" | "unit">("semester");
  const queryClient = useQueryClient();

  const semesterForm = useForm<SemesterFormData>({
    resolver: zodResolver(semesterFormSchema),
    defaultValues: {
      title: "",
      description: "",
      pattern: "",
      year: "",
      sem: "",
      branch: "",
      university: "",
      syllabus: [],
    },
  });

  const unitForm = useForm<UnitFormData>({
    resolver: zodResolver(unitFormSchema),
    defaultValues: {
      title: "",
      branch: "",
      year: "",
      sem: "",
      pattern: "",
      unitno: "",
      description: "",
      url: "",
      youtube: [],
      question: [],
    },
  });

  const semesterMutation = useMutation({
    mutationFn: async (data: SemesterFormData) => {
      const response = await apiRequest("POST", "/api/insertSemester", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Semester created successfully",
      });
      semesterForm.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/insertSemester"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error!",
        description: error.message || "Failed to create semester",
        variant: "destructive",
      });
    },
  });

  const unitMutation = useMutation({
    mutationFn: async (data: UnitFormData) => {
      const response = await apiRequest("POST", "/api/insertUnitAndAppend", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Unit content created successfully",
      });
      unitForm.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/insertUnitAndAppend"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error!",
        description: error.message || "Failed to create unit content",
        variant: "destructive",
      });
    },
  });

  const onSemesterSubmit = (data: SemesterFormData) => {
    semesterMutation.mutate(data);
  };

  const onUnitSubmit = (data: UnitFormData) => {
    unitMutation.mutate(data);
  };

  const patterns = ["2019 Pattern", "2024 Pattern"];
  const years = ["FE", "SE", "TE", "BE"];
  const semesters = ["1", "2"];
  const branches = [
    "Computer Engineering",
    "Mechanical Engineering", 
    "Civil Engineering",
    "Electrical Engineering",
    "Electronics Engineering",
    "Information Technology",
    "AIDS",
    "AIML"
  ];
  const universities = ["SPPU University", "Mumbai University", "Pune University"];
  const units = ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5", "Unit 6"];

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-sm border-r border-slate-200 fixed h-full z-10">
        <div className="p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="text-white h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">StudyHub</h1>
              <p className="text-sm text-slate-500">Admin Panel</p>
            </div>
          </div>
        </div>
        
        <nav className="px-4">
          <ul className="space-y-2">
            <li>
              <Button
                variant={activeView === "semester" ? "default" : "ghost"}
                className={`w-full justify-start ${
                  activeView === "semester" 
                    ? "bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-50" 
                    : "text-slate-600 hover:text-slate-900"
                }`}
                onClick={() => setActiveView("semester")}
              >
                <Plus className="mr-3 h-4 w-4" />
                Add Subject
              </Button>
            </li>
            <li>
              <Button
                variant={activeView === "unit" ? "default" : "ghost"}
                className={`w-full justify-start ${
                  activeView === "unit" 
                    ? "bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-50" 
                    : "text-slate-600 hover:text-slate-900"
                }`}
                onClick={() => setActiveView("unit")}
              >
                <FileText className="mr-3 h-4 w-4" />
                Add Unit Content
              </Button>
            </li>

          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">
                {activeView === "semester" ? "Add Semester" : "Add Unit Content"}
              </h2>
              <p className="text-slate-600 mt-1">
                {activeView === "semester" 
                  ? "Create new semester with subject information"
                  : "Add unit-wise educational content and resources"
                }
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-600">
                <Bell className="h-5 w-5" />
              </Button>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">A</span>
              </div>
            </div>
          </div>
        </header>

        {/* Add Semester Form */}
        {activeView === "semester" && (
          <Card className="bg-white rounded-xl shadow-sm border border-slate-200">
            <CardContent className="p-8">
              <Form {...semesterForm}>
                <form onSubmit={semesterForm.handleSubmit(onSemesterSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <FormField
                      control={semesterForm.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem className="lg:col-span-2">
                          <FormLabel>
                            Subject <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Computer Engineering Semester 1" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={semesterForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem className="lg:col-span-2">
                          <FormLabel>
                            Description <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Detailed description of the semester curriculum..."
                              rows={4}
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={semesterForm.control}
                      name="pattern"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Pattern <span className="text-red-500">*</span>
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Pattern" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {patterns.map(pattern => (
                                <SelectItem key={pattern} value={pattern}>{pattern}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={semesterForm.control}
                      name="year"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Academic Year <span className="text-red-500">*</span>
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Year" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {years.map(year => (
                                <SelectItem key={year} value={year}>{year}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={semesterForm.control}
                      name="sem"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Semester <span className="text-red-500">*</span>
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Semester" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {semesters.map(sem => (
                                <SelectItem key={sem} value={sem}>{sem}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={semesterForm.control}
                      name="branch"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Branch <span className="text-red-500">*</span>
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Branch" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {branches.map(branch => (
                                <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={semesterForm.control}
                      name="university"
                      render={({ field }) => (
                        <FormItem className="lg:col-span-2">
                          <FormLabel>
                            University <span className="text-red-500">*</span>
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select University" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {universities.map(university => (
                                <SelectItem key={university} value={university}>{university}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    
                  </div>

                  <div className="flex justify-end space-x-4 pt-4">
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                    <Button type="submit" disabled={semesterMutation.isPending}>
                      <Save className="mr-2 h-4 w-4" />
                      {semesterMutation.isPending ? "Saving..." : "Save Semester"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        {/* Add Unit Form */}
        {activeView === "unit" && (
          <Card className="bg-white rounded-xl shadow-sm border border-slate-200">
            <CardContent className="p-8">
              <Form {...unitForm}>
                <form onSubmit={unitForm.handleSubmit(onUnitSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <FormField
                      control={unitForm.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem className="lg:col-span-2">
                          <FormLabel>
                            Subject <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Introduction to Object Oriented Programming" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={unitForm.control}
                      name="branch"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Branch <span className="text-red-500">*</span>
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Branch" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {branches.map(branch => (
                                <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={unitForm.control}
                      name="year"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Academic Year <span className="text-red-500">*</span>
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Year" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {years.map(year => (
                                <SelectItem key={year} value={year}>{year}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={unitForm.control}
                      name="sem"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Semester <span className="text-red-500">*</span>
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Semester" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {semesters.map(sem => (
                                <SelectItem key={sem} value={sem}>{sem}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={unitForm.control}
                      name="pattern"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Pattern <span className="text-red-500">*</span>
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Pattern" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {patterns.map(pattern => (
                                <SelectItem key={pattern} value={pattern}>{pattern}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={unitForm.control}
                      name="unitno"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Unit Number <span className="text-red-500">*</span>
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Unit" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {units.map(unit => (
                                <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={unitForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem className="lg:col-span-2">
                          <FormLabel>
                            Description <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Detailed description of the unit content..."
                              rows={4}
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={unitForm.control}
                      name="url"
                      render={({ field }) => (
                        <FormItem className="lg:col-span-2">
                          <FormLabel>
                            PDF Document URL <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="url"
                              placeholder="https://drive.google.com/file/d/..."
                              {...field}
                              onChange={(e) => {
                                let url = e.target.value;
                                // Convert Google Drive view URLs to preview URLs
                                if (url.includes('drive.google.com/file/d/') && url.includes('/view')) {
                                  url = url.replace('/view?usp=sharing', '/preview').replace('/view', '/preview');
                                }
                                field.onChange(url);
                              }}
                            />
                          </FormControl>
                          <p className="text-sm text-slate-500">Paste Google Drive link - it will auto-convert to preview format</p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={unitForm.control}
                      name="youtube"
                      render={({ field }) => (
                        <FormItem className="lg:col-span-2">
                          <FormLabel>
                            YouTube Video URLs <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <ArrayInput
                              items={field.value || []}
                              onUpdate={field.onChange}
                              placeholder="https://www.youtube.com/watch?v=..."
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={unitForm.control}
                      name="question"
                      render={({ field }) => (
                        <FormItem className="lg:col-span-2">
                          <FormLabel>
                            Practice Questions <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <ArrayInput
                              items={field.value || []}
                              onUpdate={field.onChange}
                              placeholder="Enter a practice question..."
                              multiline
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end space-x-4 pt-4">
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                    <Button type="submit" disabled={unitMutation.isPending}>
                      <Save className="mr-2 h-4 w-4" />
                      {unitMutation.isPending ? "Saving..." : "Save Unit Content"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
