import React from 'react'

const FilterPosts = ({setFilterBy,filterBy}) => {

  return (
    <select name="postFilter" id="filter" key={filterBy} className='[&_*]:text-black text-white ml-[2rem] p-3 border border-orange-500 rounded-md' value={filterBy}  onChange={(e)=>setFilterBy(e.target.value)}>
        <option value="DateAsc">Recent Posts</option>
        <option value="Likes">Most Liked</option>
        <option value="DateDsc">Oldest Posts</option>
        </select>
  )
}

export default FilterPosts
