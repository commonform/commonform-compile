var predicate = require('commonform-predicate');
var resolve;

module.exports = function(element, values, numbering, headings) {
  resolve = resolve || require('./form');

  if (predicate.text(element)) {
    return element;

  } else if (predicate.use(element)) {
    return element.use;

  } else if (predicate.child(element)) {
    element.numbering = numbering.numbering;
    element.form = resolve(
      element.form,
      values,
      numbering.form || null,
      headings
    );
    return element;

  } else if (predicate.definition(element)) {
    return element;

  } else if (predicate.reference(element)) {
    var heading = element.reference;
    // Resolvable
    if (headings.hasOwnProperty(heading)) {
      var matches = headings[heading];
      // Unambiguous
      if (matches.length === 1) {
        return {reference: matches[0]};
      // Ambiguous
      } else {
        return {
          ambiguous: true,
          numberings: matches,
          reference: heading
        };
      }
    // Broken
    } else {
      element.broken = true;
      return element;
    }

  } else if (predicate.blank(element)) {
    var value = element.blank;
    // Filled
    if (values.hasOwnProperty(value)) {
      return values[value];
    // Empty
    } else {
      return {blank: value};
    }

  } else {
    throw new Error('Invalid content: ' + JSON.stringify(element));
  }
};
