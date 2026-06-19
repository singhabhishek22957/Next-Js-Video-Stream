import {
  getAllGenresAction,
} from "@/features/genre/actions/genre.action";

import GenreManager from "@/components/genre/genreManager";

export default async function GenresPage() {
  const result =
    await getAllGenresAction();

  return (
    <div className="p-6">
      <GenreManager
        genres={
          result.genres || []
        }
      />
    </div>
  );
}
