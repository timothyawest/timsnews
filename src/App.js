import React, { Component } from 'react';
import $ from 'jquery';
import './App.css';
import ArticleList from './components/Articles';
import OptionsContainer from './components/OptionsContainer';
import NavBar from './components/NavBar';

function createCookie(name, value, days) {
  var expires;
  let myvalue =JSON.stringify(value);
  if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toGMTString();
  } else {
      expires = "";
  }
  document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(myvalue) + expires + "; path=/";
}

function readCookie(name) {
  var nameEQ = encodeURIComponent(name) + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) === ' ')
          c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0)
          return JSON.parse(decodeURIComponent(c.substring(nameEQ.length, c.length)));
  }
  return null;
}

function eraseCookie(name) {
  createCookie(name, "", -1);
}

let toProperCase = function(str) 
{
   
   return str.charAt(0).toUpperCase() + str.substring(1,str.length).toLowerCase();
}

class App extends Component {
  
  constructor(props){
    super(props);
    let cookieState= readCookie("mynews");
    let cookieSearchTerm = readCookie("mynewssearchterm");
    if(cookieSearchTerm ===null){
      cookieSearchTerm="";
    }
    if(cookieState===null){
      cookieState= {CategorySelect:"General",
        SourceSelect:"No-Preference",
        PublisherSources:[],
        CountrySelect:{value:"us",label:"United States",
      }
      };
    }
    this.state={
      optionsShowing:false,
      searchterm:cookieSearchTerm,
      isLoaded:false,
      totalResults:0,
      isANewSearch:true,
      page:1,
      lastPageGot:0,
      pageSize:100,
      error:null,
      options: cookieState,
      articles:[]

    }
  
    this.handleSearch = this.handleSearch.bind(this);
    this.handleMenuClick = this.handleMenuClick.bind(this);
    this.handleOptionsClose = this.handleOptionsClose.bind(this);
    this.handleScrollBottom = this.handleScrollBottom.bind(this);
    this.ti= null;//see if we are done typing
    
    $(window).scroll(this.handleScrollBottom);
  }
  handleScrollBottom() {
    if($(window).scrollTop() + $(window).height() === $(document).height() && this.state.page*this.state.pageSize < this.state.totalResults) {
        this.setState({page: this.state.lastPageGot+1});
    }
  }
  fetchnews(){
    /* only while doing options layoout
      this.setState({isLoaded:true});
      return;
     /*only while doing options layoout*/
    let country = "country=us";
    let sources="";
    let category="";
    const page="&page="+this.state.page;
    const pageSize="&pageSize="+this.state.pageSize;
    if(this.state.isANewSearch){
      window.scrollTo(0,0);
      this.setState({page:1,lastPageGot:0});
    }
      this.setState({isANewSearch:false});
    if(this.state.options.SourceSelect==="No-Preference"){
      category="&category="+encodeURIComponent(this.state.options.CategorySelect);
      sources="";
      country ="country="+encodeURIComponent(this.state.options.CountrySelect.value);
    }else{
      country="";
      category="";
      sources="sources="+Object.keys(this.state.options.PublisherSources).reduce((first,last)=>{
          return first+","+encodeURIComponent(last);
      });
    }
    let searchString="https://newsapi.org/v2/top-headlines?"+sources+country+category+pageSize+page+"&apiKey=8a22a0c071e2451f877ff86a85e05e8c";
    if(this.state.searchterm !==""){
      searchString="https://newsapi.org/v2/everything?q="+encodeURIComponent(this.state.searchterm)+pageSize+page+"&sortBy=publishedAt&apiKey=8a22a0c071e2451f877ff86a85e05e8c";
    }
    $.getJSON(searchString)
      .done(
        (result) => {
          if(result.articles !==undefined){
            let articles = this.state.articles;
            if(this.state.page>1)
              articles = articles.concat(result.articles);
            else
              articles = result.articles;
          this.setState({
            isLoaded: true,
            totalResults: result.totalResults,
            articles: articles
          })};
          this.setState({lastPageGot:this.state.lastPageGot+1});
        }).fail(
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            isLoaded: false,
            error
          });
        }
      );
  }
  componentDidMount(){
    this.fetchnews();
  }
  componentDidUpdate(oldProps,oldState){
    if(this.state.options !== oldState.options || (this.state.page !== oldState.page) || this.state.isANewSearch){
      this.fetchnews();
      createCookie("mynews",this.state.options,30);
      createCookie("mynewssearchterm",this.state.searchterm,30);
    }

  }
  handleMenuClick(event){
    this.setState({optionsShowing:!this.state.optionsShowing});
  }
  handleOptionsClose(childstate,isANewSearch){
 
    this.setState(isANewSearch);
    this.setState({optionsShowing:false});
    this.setState({options: childstate});
    //this.setState({isLoaded:false});
  }

  handleSearch(event){
    event.preventDefault();
    clearTimeout(this.ti);
    this.setState({searchterm:event.target.value});
   
   // Make a new timeout set to go off in 800ms
    this.ti = setTimeout( ()=> {
         this.setState({isANewSearch:true});
         
   }, 300);
  }
  render() {
    let header ="";
    if(this.state.searchterm ===""){
      if(this.state.options.SourceSelect === "No-Preference"){
        header = "Top "+toProperCase(this.state.options.CategorySelect) + " News";
      }else{
        let newsKeys= (Object.keys(this.state.options.PublisherSources));
        header = "News from " + newsKeys.reduce((first,second)=>{
            return first+", "+this.state.options.PublisherSources[second];
        });
      }
    }
    else{
      header = "News About " +  toProperCase(this.state.searchterm);
    }
    if (this.state.error && this.state.articles.length ===0) {
      return <div>Error: {this.state.error.message}</div>;
    }
    if (!this.state.isLoaded && this.state.articles.length===0) {
      return <div>Loading...</div>;
    } else {
    return (
      <div className="App">
        <header className="App-header">
          <NavBar handleMenuClick={this.handleMenuClick}  searchterm={this.state.searchterm} handleSearch={this.handleSearch}/>
        </header>
        <OptionsContainer showing={this.state.optionsShowing} options={this.state.options} handleOptionsClose={this.handleOptionsClose}/>
        <section className="Main-Body">
            <ArticleList header={header} articles={this.state.articles}/>
            
        </section>
              

        </div>
    );
  }
  }
}

export default App;
