export const toggleSectionDisplay = (section: string | undefined): void => {
    const searchResultsRef = document.querySelector('#resultsSection') as HTMLElement;
    const detailSectionRef = document.querySelector('#detailSection') as HTMLElement;
    const randomSectionRef = document.querySelector('#randomSection') as HTMLElement;

    switch(section) {
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
}