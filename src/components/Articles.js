import React from 'react';
import './Articles.min.css';

function ArticleList(props){
  return (
   <div className="News">
      <div className="Header">
      <h1>{props.header}</h1>
      </div>
      <div className="Articles-Container">
       <Articles articles={props.articles}/>
      </div>
      <div className="App-Footer">
       <a href="http://newsapi.org">Powered by NewsApi.org</a>
      </div>
  </div>
  
  ); 
}
function Articles(props){
  let str =[];
  let articles=props.articles;
  articles.sort((item1,item2)=>{
    let a=0;
    let b=0;
    if(item1.urlToImage ==null)
      a=1;
    if(item2.urlToImage==null)
      b=1;
    return a-b;
  });

  for(let i=0;i<articles.length;i++){
    let unique="article"+i;
    let article =articles[i];
    str.push(
    <div key={unique} id={unique} className="Article">
      <div className="Source">
        <div className="id">
          {article.source.id}
        </div>
        <div className="Name">
          {article.source.name}
        </div>
        <div className="Author">
            {article.source.author!=null&&article.author}
        </div>
      </div>
        <h3 className="Title">
          <a className="URL-To-Article" href={article.url} taget="_blank">{article.title}</a>
        </h3>
        <img alt="" className="URL-To-Image" src={article.urlToImage}></img>
         <p>{article.description}</p>
         <p>{article.publishedAt.replace("T"," ")}</p>
        </div>);
}
  return str;
}

export default ArticleList;
