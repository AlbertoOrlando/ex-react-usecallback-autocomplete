// import './App.css'
// import { useState, useEffect, useMemo, useCallback } from 'react'

// function debounce(func, delay) {
//   let timeoutId
//   return function (...args) {
//     if (timeoutId) {
//       clearTimeout(timeoutId)
//     }
//     timeoutId = setTimeout(() => {
//       func.apply(this, args)
//     }, delay)
//   }
// }

// const API_URL = 'http://localhost:5050/products'

// const fetchProducts = async () => {
//   const response = await fetch(API_URL)
//   if (!response.ok) {
//     throw new Error('Network response was not ok')
//   }
//   const data = await response.json()
//   console.log(data);

//   return data
// }

// function App() {
//   const [products, setProducts] = useState([])
//   const [searchTerm, setSearchTerm] = useState('')
//   const [debouncedSearch, setDebouncedSearch] = useState('')


//   const debouncedSetSearch = useCallback(
//     debounce((value) => setDebouncedSearch(value), 400),
//     []
//   )

//   const handleInputChange = useCallback((e) => {
//     setSearchTerm(e.target.value)
//     debouncedSetSearch(e.target.value)
//   }, [debouncedSetSearch])

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const products = await fetchProducts()
//         setProducts(products)
//       } catch (error) {
//         console.error('Error fetching products:', error)
//       }
//     }
//     fetchData()
//     console.log('Products fetched:', products);

//   }, [])

//   const filteredProducts = useMemo(() => {
//     return products.filter(product =>
//       product.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
//       product.brand.toLowerCase().includes(debouncedSearch.toLowerCase())
//     )
//   }, [debouncedSearch, products])

//   const showDropdown = debouncedSearch.trim() !== '' && filteredProducts.length > 0

//   return (
//     <div className="autocomplete-container">
//       <input
//         type="text"
//         placeholder="Search products..."
//         value={searchTerm}
//         onChange={handleInputChange}
//         autoComplete="off"
//         className="autocomplete-input"
//       />
//       {showDropdown && (
//         <ul className="autocomplete-dropdown">
//           {filteredProducts.map(product => (
//             <li key={product.id} className="autocomplete-suggestion">
//               <strong>{product.name}</strong>
//             </li>
//           ))}
//         </ul>
//       )}
//       {filteredProducts.length === 0 && debouncedSearch.trim() !== '' && (
//         <div className="autocomplete-no-results">
//           No results found for "{debouncedSearch}"
//         </div>
//       )}
//       {filteredProducts.length === 0 && debouncedSearch.trim() === '' && (
//         <div className="autocomplete-no-results">
//           Start typing to see suggestions...
//         </div>
//       )}
//     </div>
//   )
// }

// export default App

const debounce = (func, delay) => {
  let timeoutId
  return function (value) {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => {
      func(value)
    }, delay)
  }
}




import { useState, useEffect, useCallback } from "react"

function App() {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)


  const fetchSuggestions = async (query) => {
    if (query.trim() === '') {
      setSuggestions([])
      return
    }
    try {
      const response = await fetch(`http://localhost:5050/products?q=${query}`)
      const data = await response.json()
      setSuggestions(data)
      console.log('suggestions:');

    } catch (error) {
      console.error('Error fetching suggestions:', error)
    }
  }

  const debouncedFetchSuggestions = useCallback(
    debounce(
      fetchSuggestions, 400),
    [])
  useEffect(() => {
    debouncedFetchSuggestions(query)
  }, [query])

  return (
    <>
      <div className="autocomplete-container">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search for a product..."
          className="autocomplete-input"
          autoComplete="off"
        />
        {query.trim() !== '' && suggestions.length > 0 && (
          <ul className="autocomplete-dropdown">
            {suggestions.map((suggestion) => (
              <li onClick={() => setSelectedProduct(suggestion)} key={suggestion.id} className="autocomplete-suggestion">
                {suggestion.name}
              </li>
            ))}
          </ul>
        )}
      </div>
      {selectedProduct && (
        <div className="product-details">
          <h2>{selectedProduct.name}</h2>
          <img src={selectedProduct.image} alt={selectedProduct.name} />
          <p>Price: ${selectedProduct.price}</p>
          <p>Description: {selectedProduct.description}</p>
        </div>
      )}

    </>

  )
}

export default App