module.exports =  class Category {

    constructor(slug, id, title) {
        this.slug = slug
        this.id = id
        this.title = title
    }

    print() {
        console.log("slug: ", this.slug, "id: ", this.id, "title: ", this.title)
    }
}