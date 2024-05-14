import * as React from "react";
const ImageSearchApp = () => {
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [triggerSearch, setTriggerSearch] = React.useState(false);

  const id = import.meta.env.VITE_API_KEY;

  React.useEffect(() => {
    const handleSearch = async () => {
      if (!triggerSearch || query.trim() === "") {
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

    if (triggerSearch) {
      handleSearch();
    }
  }, [id, page, query, triggerSearch]);

  const handleImageClick = (url) => {
    window.open(url);
  };

  const initiateSearch = () => {
    setTriggerSearch(true);
  };

  const handlePrevPage = () => {
    setPage(page - 1);
    initiateSearch();
  };

  const handleNextPage = () => {
    setPage(page + 1);
    initiateSearch();
  };

  React.useEffect(() => {
    if (triggerSearch) {
      setTriggerSearch(false);
    }
  }, [triggerSearch]);

  return (
    <div className="flex flex-col justify-center align-middle">
      <div className="flex flex-row justify-center align-middle m-4 gap-3 h-[3rem]">
        <input
          className="p-2 rounded-md bg-grey-200 border-yellow-950 w-3/5 focus:ring-yellow-600"
          type="text"
          value={query}
          name="query"
          placeholder="Enter some text here..."
          onChange={(e) => {
            setQuery(e.target.value);
            setTriggerSearch(false);
          }}
          onKeyUp={(e) => {
             if(e.key === "Enter"){
                initiateSearch()
             }
          }}
        />
        <div
          onClick={initiateSearch}
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
      {results.length === 0 && <div className="flex items-center justify-center text-1xl font-bold text-cyan-800">Type in the searchbox what you want to search..</div>

      }
      {loading ? (
        <div className="flex text-2xl bg-green-100 items-center justify-center w-5/5 mt-4 mx-20 p-1">
          Loading...
        </div>
      ) : (
        <div className="px-3 sm:px-5 md:px-14 grid grid-cols-2 gap-y-1 sm:grid-cols-2 sm:gap-y-6 sm:mt-4 md:grid-cols-5 md:gap-6">
          {results.map((result) => {
            return (
              <img
                key={result.id}
                className="h-48 w-48 object-cover rounded-md hover:cursor-pointer hover:shadow-lg "
                src={result.urls.small}
                alt={result.alt_description}
                onClick={() => handleImageClick(result.urls.full)}
              />
            );
          })}
        </div>
      )}
      {results != 0 && (
        <div className="flex  text-center justify-around my-1">
          <button className="bg-slate-200 px-1 text-purple-900 hover:bg-slate-300 rounded-md font-bold" onClick={handlePrevPage} disabled={page <= 1}>
            &#8592; Previous
          </button>
          <button className="bg-slate-200 px-1 text-purple-900 hover:bg-slate-300 rounded-md font-bold"  onClick={handleNextPage} disabled={page >= totalPages}>
            Next &#x2192;
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageSearchApp;
