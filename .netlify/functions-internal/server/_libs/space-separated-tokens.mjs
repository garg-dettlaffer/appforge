function parse(value) {
  const input = String(value || "").trim();
  return input ? input.split(/[ \t\n\r\f]+/g) : [];
}
export {
  parse as p
};
