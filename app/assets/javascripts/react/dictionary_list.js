var DictionaryList = React.createClass({
  currentDict: function() {
    var dict = this.props.dictionary;
    switch (dict) {
      case 'standard':
        return 'dict-standard';
        break;
      case 'homer_simpson':
        return 'dict-homer';
        break;
      case 'bee_and_puppycat':
        return 'dict-bp';
        break;
      default:
        return 'dict-standard';
        break;
    }

  
  },
  changeDict: function(e) {
    this.toggleList();

    var dict = e.target.className;
    switch (dict) {
      case 'dict-standard':
        this.props.selectedDictionary("standard");
        break;
      case 'dict-homer':
        this.props.selectedDictionary('homer_simpson');
        break;
      case 'dict-bp':
        this.props.selectedDictionary('bee_and_puppycat');
        break;
      default:
        this.props.selectedDictionary("standard");
        break;
    }
  },

  toggleList: function() {
    var hashId = "#" + this.refs.list.getDOMNode().id;
    $(hashId).toggle();
  },
  render: function() {
    console.log("rerendering with " + this.props.dictionary);
    return (
         <div id='dictionary-select'>
           <div id='current-dictionary' className={this.currentDict()} onClick={this.toggleList}>
             <img src='/assets/down-arrow.png' />
           </div>
           <ul id="dictionary-list" ref="list">
             <li className='dict-standard' onClick={this.changeDict}>Movie Clips</li>
             <li className='dict-homer' onClick={this.changeDict}>Homer Simpson</li>
             <li className='dict-bp' onClick={this.changeDict}>Bee & Puppycat</li>
           </ul>
         </div>
    );
  }
});
