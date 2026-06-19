import {
  getAllLanguagesAction,
} from "@/features/language/actions/language.action";

import LanguageManager from "@/components/language/languageManager";

export default async function LanguagesPage() {
  const result =
    await getAllLanguagesAction();

  return (
    <div className="p-6">
      <LanguageManager
        languages={
          result.languages || []
        }
      />
    </div>
  );
}
