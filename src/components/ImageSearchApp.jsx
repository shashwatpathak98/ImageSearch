import * as React from "react";
const ImageSearchApp = () => {
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const id = import.meta.env.VITE_API_KEY;

  // React.useEffect(() => {

  // }, [query, page, id , loading]);

  const handleSearch = async () => {
    if (query.trim() === "") {
      setResults([]);
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const data = await fetch(
        `https://api.unsplash.com/search/photos?query=${query}&page=${page}&client_id=${id}`
      );

      if (!data.ok) {
        throw new Error("Unable to fetch the images.");
      }

      const res = await data.json();

      setResults(res.results);
      setTotalPages(res.total_pages);
    } catch (error) {
      setError(`There is an error in fetching results`);
    } finally {
      setLoading(false);
    }
  };

  const handleImageClick = (url) => {
    window.open(url);
  };

  return (
    <div className="flex flex-col justify-center align-middle">
      <div className="flex flex-row justify-center align-middle m-4 gap-3 h-[3rem]">
        <input
          className="p-2 rounded-md bg-grey-200 border-yellow-950 w-3/5 focus:ring-yellow-600"
          type="text"
          value={query}
          name="query"
          placeholder="Enter some text here..."
          onChange={(e) => setQuery(e.target.value)}
        />
        <div
          onClick={handleSearch}
          className="bg-purple-700 hover:bg-purple-800 hover:cursor-pointer text-white font-bold p-3 rounded-md"
        >
          Search
        </div>
      </div>
      {error && (
        <div className="flex text-2xl bg-red-100 items-center justify-center w-5/5 mt-4 mx-20 p-1">
          {error}
        </div>
      )}
      {loading ? (
        <div className="flex text-2xl bg-green-100 items-center justify-center w-5/5 mt-4 mx-20 p-1">
          Loading...
        </div>
      ) : (
        <div className="px-10 grid md:grid-cols-5 md:gap-6 ">
          {results.map((result) => {
            return (
              <img
                key={result.id}
                className="h-48 w-48 object-cover rounded-md hover:cursor-pointer hover:shadow-lg"
                src={result.urls.full}
                alt={result.alt_description}
                onClick={() => handleImageClick(result.urls.full)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ImageSearchApp;
