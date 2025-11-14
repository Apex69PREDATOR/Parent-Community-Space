import {useState} from 'react'
import FilterPosts from './FilterPosts'

const Navbar = ({name,filterBy,setFilterBy,setAskName,showPostForm}) => {
  return (
    <nav className='flex w-full h-[12%] p-3 justify-between text-white items-center'>
      <div className='flex h-full gap-[2rem] items-center'>
       <img src="" alt=""  className='bg-white h-[4rem] w-[4rem] rounded-full'/>
        <span className='text-2xl'>{name?(<div><span className='text-[2.5rem] font-semibold'>Welcome</span> <span className='font-medium text-orange-400'> {name}</span></div>):<span><button className='bg-orange-500 p-3 rounded-xl border border-white font-bold text-lg cursor-pointer' onClick={()=>setAskName(true)}>Click</button> to set your name</span>}</span>
      </div>
      <div><span className='text-lg'>Arrange <b className='text-orange-400 text-xl'>Tweets</b> by </span> <FilterPosts filterBy={filterBy} setFilterBy={setFilterBy}/></div>
        <button className='bg-orange-500 p-3 rounded-xl mr-[3rem] border border-white font-bold text-lg cursor-pointer' onClick={()=>showPostForm(true)}>+ Upload Tweet</button>
    </nav>
  )
}

export default Navbar
