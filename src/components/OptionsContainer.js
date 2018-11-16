import React, { Component } from 'react';
import './OptionsContainer.min.css';
import {NewsSources,PublisherSources,NewsCategories,CountrySources} from'./Options.js';
import BackSVG from "./back.svg";

class OptionsContainer extends Component {
  constructor(props){
    super(props);
    this.state = props.options;
      
    this.handleSourceSelect  = this.handleSourceSelect.bind(this);
    this.handleCategorySelect = this.handleCategorySelect.bind(this);
    this.handleOptionsClose = this.handleOptionsClose.bind(this);
    this.handlePublisherSourcesSelect =this.handlePublisherSourcesSelect.bind(this);
    this.handleCountrySelect = this.handleCountrySelect.bind(this);
  }
  handlePublisherSourcesSelect(source){
    this.setState({PublisherSources:source });
    this.setState({isANewSearch:true});
   
  }
  handleSourceSelect(source){
    console.log(source.value)
    this.setState({SourceSelect: source.value});
    this.setState({isANewSearch:true});
   
  }
  handleCategorySelect(category){
    this.setState({CategorySelect: category.value});
    this.setState({isANewSearch:true});
   
  }
  handleOptionsClose(event){
    this.props.handleOptionsClose({  
      CategorySelect:this.state.CategorySelect,
      SourceSelect:this.state.SourceSelect,
      PublisherSources:this.state.PublisherSources,
      CountrySelect:this.state.CountrySelect},
      {isANewSearch:true});
      this.setState({isANewSearch:false});
  }
  handleCountrySelect(country){
    console.log("handleCountrySelect");
    this.setState({CountrySelect: country});
  }
  componentDidUpdate(lastprop,laststate){
    console.log(this.state.PublisherSources);

  }
  
  render(){
    let classes = "Options-Container"
    if(this.props.showing){
      classes +=" FromLeft";
    }
    else{
      classes +=" UnFromLeft";
    }
    const newssources =true;
    return (
      <section className={classes}>
        
        <div className="Options-Options">
        <div className="Close-Button" onClick={this.handleOptionsClose}>
        <img width="24" src={BackSVG} type="image/svg+xml" alt="Arrow Pointing Left"></img>
        </div>
         
            {newssources&&<NewsSources 
              SourceSelect={this.state.SourceSelect}
              handleSourceSelect={this.handleSourceSelect}
            />}
            {this.state.SourceSelect==="Publishers"&&
            <PublisherSources
              handlePublisherSourcesSelect={this.handlePublisherSourcesSelect} chosen={this.state.PublisherSources} 
            />}
            {this.state.SourceSelect==="No-Preference"&&
            <CountrySources
              CountrySelect={this.state.CountrySelect}
              handleCountrySelect={this.handleCountrySelect} 
            />}
            {this.state.SourceSelect==="No-Preference"&&
            <NewsCategories
              CategorySelect={this.state.CategorySelect}
              handleCategorySelect={this.handleCategorySelect} 
            />}

        </div>

      </section>
    );
  }
}

export default OptionsContainer;
