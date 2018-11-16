import React from 'react';
import $ from 'jquery';
import Select from 'react-select';
const sourcesSelect =[
    {value:'No-Preference',label:"No Preference"},
    {value:'Publishers',label:'Publishers'}
];
  const categorySelect =[
    {value:'General',label:'General'},
    {value:'Business',label:'Business'},
    {value:'Technology',label:'Technology'},
    {value:'Entertainment',label:'Entertainment'},
    {value:'Sports',label:'Sports'},
    {value:'Science',label:'Science'},
    {value:'Health',label:'Health'}
    ];
const countrySelect =[
    {value:"ar",label:"Argentina"},
    {value:"us",label:"United States"},
    {value:"th",label:"Thailand"}
    ];
    
    let publisherSources=[];
function getPublisherSources(){
    let searchString="https://newsapi.org/v2/sources?apiKey=8a22a0c071e2451f877ff86a85e05e8c";
    $.getJSON(searchString)
        .done(
            (result) => {
            
        publisherSources = result.sources.map(source=>{
        return  {value:source.id,label:source.name};
        });

    }).fail(
    // Note: it's important to handle errors here
    // instead of a catch() block so that we don't swallow
    // exceptions from actual bugs in components.
    (error) => {
        
    }
    );

}
    
function Scroll_To_Top(event){
    event.target.scrollIntoView({block: "start", inline: "start"});
}

function NewsSources(props){
    if(publisherSources.length===0){
        getPublisherSources();
    }
    console.log(props);
    return(
        <div className="News-Select">
        <strong>Sources by:</strong>
        <Select  
            defaultValue={[{value:props.SourceSelect,label:props.SourceSelect}]}
            options = {sourcesSelect}
            onChange = {props.handleSourceSelect}
            isSearchable ={false}
        />
    </div>
    );

}


function NewsCategories(props){
    return (
        <div className="News-Select" onFocus={Scroll_To_Top}>
            <strong>Categories:</strong>
            <Select
               defaultValue={[{value:props.CategorySelect,label:props.CategorySelect}]}
               options={categorySelect}
               onChange ={props.handleCategorySelect}
               isSearchable={false}
            /> 
          </div>
    );
}
function PublisherSource(props){
    let publisher=[];
    publisherSources.forEach((item)=>{
        if(item.value in props.chosen){
            publisher.push(
                <div key={item.value} id={item.value} onClick={props.onClick}>
                {item.label} &#x2713;
                </div>
            );
        }
            else{
            publisher.push(
                <div key={item.value} id={item.value} onClick={props.onClick}>
                {item.label}
                </div>
            );
        }
    });
    return (
        publisher
    );
}
function PublisherSources(props){
    let chosen = Object.assign({},props.chosen);
    function onClick(event){
        if(event.target.id in chosen){
            console.log(chosen);
            delete(chosen[event.target.id])
            console.log(chosen);
          
        }else{
            console.log(chosen);
            console.log(event.target.innerHTML);
            chosen[event.target.id] = event.target.innerHTML;
            console.log(chosen);
        }
        props.handlePublisherSourcesSelect(chosen);
        console.log(event.target.id);
    }
    
    return(
    <div className="News-Select" onFocus={Scroll_To_Top}>
        <strong>Publisher Sources:</strong>
        <PublisherSource onClick={onClick} chosen={props.chosen}/>
    </div>
    );
}
function CountrySources(props){
    return(
        <div className="News-Select" onFocus={Scroll_To_Top}>
            <strong>News From:</strong>
        <Select
            defaultValue={props.CountrySelect}
            options={countrySelect}
            onChange={props.handleCountrySelect}
            isSearchable={false}
        />
        </div>
    );
}
export {NewsSources,PublisherSources,NewsCategories,CountrySources}; 
