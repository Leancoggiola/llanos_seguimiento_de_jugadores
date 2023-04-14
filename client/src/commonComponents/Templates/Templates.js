const escapeSpecialCharacters = str => str.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');

const DefaultOptionTemplate = (props) => {
    const { searchTerm = '', value = '' } = props;
    const parts = value.split(new RegExp(`(${escapeSpecialCharacters(searchTerm)})`, 'gi'));
  
    return (
      <span>
        {parts.map((part, ind) => (
          <span
            key={ind}
            style={part.toLowerCase() === searchTerm.toLowerCase() ? { fontWeight: 'bold' } : {}}
          >
            {part}
          </span>
        ))}
      </span>
    );
};

export { DefaultOptionTemplate };