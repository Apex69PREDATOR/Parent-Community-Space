import FilterPosts from './FilterPosts'

const Navbar = ({name,filterBy,setFilterBy,setAskName,showPostForm}) => {
  return (
    <nav className='flex w-full md:h-[12%] h-[9%] md:p-3  justify-between text-white items-center'>
      <div className='flex h-full md:gap-[2rem] gap-[0.5rem] md:px-0 px-1 items-center'>
       <img src="" alt=""  className='bg-white md:h-[4rem] h-[2.2rem] md:w-[4rem] w-[2.2rem] rounded-full'/>
        <span className='md:text-2xl text-lg'>{name?(<div><span className='md:text-[2.5rem] text-[1.5rem] font-semibold'>Welcome</span> <span className='font-medium text-orange-400'> {name}</span></div>):<span><button className='bg-orange-500 md:p-3 p-1 rounded-xl border border-white font-bold md:text-lg text-sm cursor-pointer' onClick={()=>setAskName(true)}>Click</button> to set your name</span>}</span>
      </div>
      {window.innerWidth>475?<div><span className='text-md text-center'>Arrange <b className='text-orange-400 md:text-xl'>Tweets</b> by </span> <FilterPosts filterBy={filterBy} setFilterBy={setFilterBy}/></div>:<></>}
        <button className='bg-orange-500 p-3 rounded-xl md:mr-[3rem] mr-[0.5rem] border border-white font-bold md:text-lg text-md cursor-pointer shadow-xl' onClick={()=>showPostForm(true)}>+ Upload Tweet</button>
    </nav>
  )
}

export default Navbar
