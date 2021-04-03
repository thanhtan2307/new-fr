import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import api from '../../utils/axios'

const FilterSelector = (props) => {
  const [category, setCategory] = useState(null)
  const [createDate, setCreateDate] = useState(null)
  const [currentFilter, setCurrentFilter] = useState([])
  const [currentFilterCate, setCurrentFilterCate] = useState(null)
  const [currentFilterDate, setCurrentFilterDate] = useState(null)
  const [filterActive, setFilterActive] = useState(
    {
      all: true,
      categories: false,
      sort: false
    }
  )

  const filterByCategory = (categoryId, categoryName) => {
    const newList = currentFilter.filter(x => x.type !== 'category')

    setFilterActive({
      ...filterActive,
      categories: true,
      all: false
    })

    setCurrentFilter([
      ...newList,
      {
        type: 'category',
        value: categoryName
      }
    ])

    setCurrentFilterCate(categoryId)

    const query = {
      category: categoryId,
      date: currentFilterDate
    }

    props.totalFilter(query)
  }

  const filterByCreateDate = (type, sortName) => {
    const newList = currentFilter.filter(x => x.type !== 'sort')

    setFilterActive({
      ...filterActive,
      sort: true,
      all: false
    })

    setCurrentFilter([
      ...newList,
      {
        type: 'sort',
        value: sortName
      }
    ])

    setCurrentFilterDate(type)

    const query = {
      category: currentFilterCate,
      date: type
    }

    props.totalFilter(query)
  }

  const filterAll = () => {
    setFilterActive({
      ...filterActive,
      all: true,
      categories: false,
      sort: false
    })
    setCurrentFilter([])
    props.totalFilter({})
  }

  const removeTag = (type) => {
    const newList = currentFilter.filter(x => x.type !== type)
    setCurrentFilter(newList)

    if (type === 'category') {
      setFilterActive({
        ...filterActive,
        categories: false,
      })
    } else if (type === 'sort') {
      setFilterActive({
        ...filterActive,
        sort: false,
      })
    }

    const query = {
      category: currentFilterCate,
      date: currentFilterDate
    }

    if (type === 'category') {
      query.category = null
      setCurrentFilterCate(null)
    } else if (type === 'sort') {
      query.date = null
      setCurrentFilterDate(null)
    }

    if(newList.length === 0) {
      setFilterActive({
        categories: false,
        sort: false,
        all: true
      })
    } 

    props.totalFilter(query)
  }

  useEffect(() => {
    api('GET', 'api/categories')
      .then(res => {
        if (res.data && res.data.status) {
          setCategory(res.data.categories)
        }
      })
  }, [])

  return (
    <>
      <div id='filter'>
        <div className='filter-container'>
          <i className="fas fa-filter"></i>
          <ul className='filter-list'>
            <li className={filterActive.all ? 'filter-item active' : 'filter-item'} onClick={filterAll}>All</li>
            <li className={filterActive.categories ? 'filter-item active' : 'filter-item'}>
              Categories
              {
                category && category.length > 0 &&
                <ul className='filter-menu'>
                  {
                    category.map(item => (
                      <li onClick={() => filterByCategory(item._id, item.name)}>{item.name}</li>
                    ))
                  }
                </ul>
              }
            </li>
            <li className={filterActive.sort ? 'filter-item active' : 'filter-item'}>Date
              <ul className='filter-menu'>
                <li onClick={() => filterByCreateDate('-createDate', 'Latest')}>Latest</li>
                <li onClick={() => filterByCreateDate('createDate', 'Earliest')}>Earliest</li>
              </ul>
            </li>
          </ul>
        </div>
        {
          currentFilter && currentFilter.length > 0 &&
          <div className='filter-tag-container'>
            <span>Filter by: </span>
            <div className='filter-tags'>
              {
                currentFilter.map(item =>
                  <div className='tag'>
                    <span>
                      {item.value}
                    </span>
                    <i onClick={() => removeTag(item.type)} className="far fa-times-circle"></i>
                  </div>
                )
              }
              <div className='tag' onClick={filterAll}>
                <span style={{ color: 'rgb(238, 63, 63)', cursor: 'pointer' }}>
                  Remove all filter
                </span>
              </div>
            </div>
          </div>
        }
      </div>
      {/* <div id='mb-filter'>
        <button>
          <span>Filter</span>
          <i className="fas fa-filter"></i>
        </button>
      </div> */}
      <div className='opt'>
        <div className='all-post'>
          {
            props.length > 0 &&
            <span>{`${props.length}/${props.total}`}</span>
          }

          <span className='line'></span>
        </div>
        <div className='create-post'>
          <Link to='/posts/create' className='create-new'>
            Create a new post?
          </Link>
          <i className="fas fa-pen-alt"></i>
        </div>
      </div>
    </>
  )

}

export default FilterSelector