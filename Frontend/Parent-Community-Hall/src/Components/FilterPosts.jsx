import React from 'react'

const FilterPosts = ({setFilterBy,filterBy}) => {

  return (
    <select name="postFilter" id="filter" key={filterBy} className='[&_*]:text-black text-white md:ml-[2rem] ml-[1rem] md:p-3 p-1 border border-orange-500 rounded-md' value={filterBy}  onChange={(e)=>setFilterBy(e.target.value)}>
        <option value="DateAsc">Recent Posts</option>
        <option value="Likes">Most Liked</option>
        <option value="DateDsc">Oldest Posts</option>
        </select>
  )
}

export default FilterPosts
