import { useState, useEffect } from 'react'
import axios from 'axios'


const Crawl = () => {

  const [page, setpage] = useState(1)
  const [results, setresults] = useState([])

  useEffect(() => {
    Effect_news();
  }, [page])


  const Effect_news = async() =>{
    const res = await axios.get(`api/news`,{headers:{page:page}})
    setresults(res.data.news)
    console.log(res.data)
  }
  return (
    <div className='container'>
      <h2 style={{textAlign:'center', margin:'10px'}}>Crawl Page</h2>
        {results && results.map((news, index) => (
                    <div style={{height:'300px',color:'black',display:'flex',padding:'10px',marginBottom:'10px'}}>
                         <img alt='' src={news.img } style={{height:'300px',width:'280px'}}/>
                        <a alt="source" href={news.href}  target="_blank" >
                        <div style={{marginLeft:'30px'}}>
                                <h1>{news.title}</h1><p/>
                                {news.description}
                        </div>
                        </a>
                    </div>
                ))}



<div style={{marginLeft:'40%'}}>
<button style={{width:'100px',height:'50px', margin:'30px'}} onClick={()=>{if(page>1) setpage(page-1); window.scrollTo(0, 0);}}>Preview</button>
<button style={{width:'100px',height:'50px', margin:'30px'}} onClick={()=>{setpage(page+1); window.scrollTo(0, 0);}}>Next</button>
</div> 
    </div>
  )
}

export default Crawl