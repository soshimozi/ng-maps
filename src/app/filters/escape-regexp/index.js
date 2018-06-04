function escapeRegexpFilter() {
    return function(string) {
		return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
	};
};


module.exports = escapeRegexpFilter;