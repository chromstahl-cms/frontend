export const css = `
.blogTextContainer * > img {
    height: 25%;
}

.blogTextContainer {
    line-height: 1.4rem;
    max-width: 50vw;
}

.blogTextContainer > * p {
    margin-top: 0.5rem;
}

.blogHeadingContainer > h1,
.blogHeadingContainer > h2,
.blogHeadingContainer > h3,
.blogHeadingContainer > h4,
.blogHeadingContainer > h5,
.blogHeadingContainer > h6 {
    margin: 1rem;
    margin-left: 0;
    margin-top: 0;
}


.blogPostContainer {
    margin-top: 2em;
    margin-bottom: 2em;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2em;
}

.blogHeadingContainer {
    display: flex;
    width: 100%;
}

.blogHeadingContainer > p {
    margin-left: auto;
    color: #d1d1d1;
}
`
