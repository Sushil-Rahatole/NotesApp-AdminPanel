import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X, Plus } from "lucide-react";

interface ArrayInputProps {
  items: string[];
  onUpdate: (items: string[]) => void;
  placeholder: string;
  multiline?: boolean;
}

export function ArrayInput({ items, onUpdate, placeholder, multiline = false }: ArrayInputProps) {
  const [currentValue, setCurrentValue] = useState("");

  const addItem = () => {
    if (currentValue.trim()) {
      onUpdate([...items, currentValue.trim()]);
      setCurrentValue("");
    }
  };

  const removeItem = (index: number) => {
    onUpdate(items.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      addItem();
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex space-x-2">
        {multiline ? (
          <Textarea
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
            placeholder={placeholder}
            onKeyPress={handleKeyPress}
            rows={2}
            className="flex-1 resize-none"
          />
        ) : (
          <Input
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
            placeholder={placeholder}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
        )}
        <Button type="button" onClick={addItem} className="px-4">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      {items.length > 0 && (
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className="flex items-start justify-between p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-700 flex-1 break-words">{item}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeItem(index)}
                className="text-red-500 hover:text-red-700 ml-2"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
