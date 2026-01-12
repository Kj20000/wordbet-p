import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category } from "../hooks/useWords";

interface LearningHeaderProps {
  categories: Category[];
  selectedCategory: string;
  pendingCategory: string;
  onCategoryChange: (value: string) => void;
}

export const LearningHeader = ({
  categories,
  selectedCategory,
  pendingCategory,
  onCategoryChange,
}: LearningHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-r from-primary to-secondary p-3 rounded-b-3xl shadow-lg relative z-10">
      <div className="flex justify-between items-center px-3">
        <h1 className="text-2xl font-black text-white drop-shadow-lg">🎨 Word Learning</h1>
        <div className="flex items-center gap-3">
          <Select value={pendingCategory} onValueChange={onCategoryChange}>
            <SelectTrigger className="h-9 w-[140px] bg-white/30 text-white font-bold rounded-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">🌟 All</SelectItem>
              {categories.map(c => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={() => navigate("/settings")}
            size="icon"
            className="bg-white/30 text-white h-9 w-9 rounded-full hover:bg-white/50"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
