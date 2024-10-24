class ApiFeatures {
    constructor(queryObject, queryStr) {
        this.queryObject = queryObject;
        this.queryStr = queryStr;
    }

    fieldsFilter() {
        const excludedProperty = ['sort', 'page', 'limit', 'date_from', 'date_till'];
        let shallowObject = {...this.queryStr};
        excludedProperty.forEach((ele) => {
            delete shallowObject[ele];
        })

        if (this.queryStr.date_from || this.queryStr.date_till) {
            shallowObject.startDate = {};
            if (this.queryStr.date_from) {
                const [day, month, year] = this.queryStr.date_from.split('-');
                const formattedDate = new Date(`${year}-${month}-${day}`);
                shallowObject.startDate.$gte = formattedDate;
            }
            if (this.queryStr.date_till) {
                const [day, month, year] = this.queryStr.date_till.split('-');
                const formattedDate = new Date(`${year}-${month}-${day}`);
                shallowObject.startDate.$lte = formattedDate;
            }
        }
        this.queryObject = this.queryObject.find(shallowObject);
        return this;
    }

    paginate() {
        const page = +this.queryStr.page || 1;
        const limit = +this.queryStr.limit || 10;
        const skip = (page - 1) * limit;
        this.queryObject = this.queryObject.skip(skip).limit(limit);
        return this;
    }

    sort() {
        if(this.queryStr.sort) {
            const sortBy = this.queryStr.sort.split(',').join(' ');
            this.queryObject = this.queryObject.sort(sortBy);
        }
        return this;
    }
}

module.exports = ApiFeatures;