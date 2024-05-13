import * as React from 'react'

const ImageSearchApp = () => {

  const [query , setQuery] = React.useState("");
  const [results ,setResults] = React.useState([])
  const [page , setPage] = React.useState(1)
  const [totalPages , setTotalPages] = React.useState(0)
  const [loading , setLoading] = React.useState(false);
  const [error , setError] = React.useState(null)
  
  const id = "10NEsSv1SMwFqPc35fhBcZgu9U4KDu_xe6X6bX4G8GA"

  React.useEffect(() => {
    

      const fetchData = async () => {

        if(query.trim() === ""){
            setResults([])
            return;
        }

         setError(null)
         setLoading(true)
        try{
            const data = await fetch(`https://api.unsplash.com/search/photos?query=${query}&page=${page}&client_id=${id}`) 
            
            if(!data.ok){
                throw new Error('Unable to fetch the images.')
            }
            
            const res = await data.json()
            
            setResults(res.results)
            setTotalPages(res.total_pages)

         }catch(error){
            setError(`There is an error in fetching results`)
         }
         setLoading(false)
      }
      
      fetchData();
    } , [query , page, id])

  return (
    <div>
       <form className="flex flex-row justify-center" onSubmit={(e) => e.preventDefault()}>
          <input 
          className='border border-12 border-collapse p-2 rounded-md bg-red-100 border-yellow-950 mt-8 w-1/5'
            type="text" 
            value={query}
            name='query'
            placeholder='Enter some text here...'
            onChange={(e) => setQuery(e.target.value)}
            />  
       </form>
       {error && <div className='flex text-2xl bg-red-100 items-center justify-center w-5/5 mt-4 mx-20 p-1'>{error}</div>} 
       {
        loading ?
        (
            <div>
                 Loading...
            </div>
        ):
        (<div>
            <table>
                <tbody>
               <tr>
                 {
                  results.map((result) => {
                    return (
                      <td key={result.id}> <img src={result.urls.full} alt={result.alt_description} /> </td>
                    )
                  })  
                 }  
               </tr>
               </tbody>
            </table>
        </div>
        )
       }
    </div>
  )
}

export default ImageSearchApp