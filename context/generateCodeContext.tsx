import { createContext} from "react";

type GenerateCodeContextType = {
  isGenerating: boolean;
  setIsGenerating: (isGenerating: boolean) => void;
};

export const GenerateCodeContext = createContext<GenerateCodeContextType>({
  isGenerating: false,
  setIsGenerating: () => {},
});

