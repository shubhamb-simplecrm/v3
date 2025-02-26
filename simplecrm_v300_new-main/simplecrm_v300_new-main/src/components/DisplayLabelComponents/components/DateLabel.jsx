import parse from "html-react-parser";

export const DateLabel = ({ fieldValue }) => {
  return parse(`<span>${fieldValue}</span>`);
};
