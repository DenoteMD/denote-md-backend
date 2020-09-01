import React from 'react';

interface comProps {
  contentMarkdown: string;
}

const Markdown = ({ contentMarkdown }: comProps) => {
  const marked = require("marked");
  return (<div dangerouslySetInnerHTML={{__html: marked(contentMarkdown)}}></div>);
};

export default Markdown;