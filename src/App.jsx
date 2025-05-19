import './App.css'
import { useState, useEffect, useMemo, useCallback } from 'react'

function debounce(func, delay) {
  let timeoutId
  return function (...args) {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}

const API_URL = 'http://localhost:5050/products'

const fetchProducts = async () => {
  const response = await fetch(API_URL)
  if (!response.ok) {
    throw new Error('Network response was not ok')
  }
  const data = await response.json()
  console.log(data);

  return data
}

function App() {
  const [products, setProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')


  const debouncedSetSearch = useCallback(
    debounce((value) => setDebouncedSearch(value), 400),
    []
  )

  const handleInputChange = useCallback((e) => {
    setSearchTerm(e.target.value)
    debouncedSetSearch(e.target.value)
  }, [debouncedSetSearch])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const products = await fetchProducts()
        setProducts(products)
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    }
    fetchData()
    console.log('Products fetched:', products);

  }, [])

  const filteredProducts = useMemo(() => {
    return products.filter(product =>
      product.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      product.brand.toLowerCase().includes(debouncedSearch.toLowerCase())
    )
  }, [debouncedSearch, products])

  const showDropdown = debouncedSearch.trim() !== '' && filteredProducts.length > 0

  return (
    <div className="autocomplete-container">
      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={handleInputChange}
        autoComplete="off"
        className="autocomplete-input"
      />
      {showDropdown && (
        <ul className="autocomplete-dropdown">
          {filteredProducts.map(product => (
            <li key={product.id} className="autocomplete-suggestion">
              <strong>{product.name}</strong>
            </li>
          ))}
        </ul>
      )}
      {filteredProducts.length === 0 && debouncedSearch.trim() !== '' && (
        <div className="autocomplete-no-results">
          No results found for "{debouncedSearch}"
        </div>
      )}
      {filteredProducts.length === 0 && debouncedSearch.trim() === '' && (
        <div className="autocomplete-no-results">
          Start typing to see suggestions...
        </div>
      )}
    </div>
  )
}

export default App
