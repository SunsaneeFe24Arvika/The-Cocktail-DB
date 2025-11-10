export const toggleSectionDisplay = (section) => {
    const searchResultsRef = document.querySelector('#resultsSection');
    const detailSectionRef = document.querySelector('#detailSection');
    const randomSectionRef = document.querySelector('#randomSection');
    switch (section) {
        case 'search':
            searchResultsRef.classList.remove('d-none');
            detailSectionRef.classList.add('d-none');
            randomSectionRef.classList.add('d-none');
            break;
        case 'detail':
            searchResultsRef.classList.add('d-none');
            detailSectionRef.classList.remove('d-none');
            randomSectionRef.classList.add('d-none');
            break;
        case 'random':
            searchResultsRef.classList.add('d-none');
            detailSectionRef.classList.add('d-none');
            randomSectionRef.classList.remove('d-none');
            break;
        default:
            console.log('Something went wrong...please try again!');
    }
};
//# sourceMappingURL=toggleDisplay.js.map