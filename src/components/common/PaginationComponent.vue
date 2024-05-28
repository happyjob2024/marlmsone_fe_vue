<template>
    <nav aria-label="Page navigation example" style="z-index: 0">
        <ul class="pagination justify-content-center">
            <li class="page-item" v-if="currentPage > 1">
                <a class="page-link" @click="previousPage">Previous</a>
            </li>
            <template v-for="i in totalPages" :key="i">
                <li class="page-item">
                    <a
                        class="page-link"
                        :style="currentPage == i ? { backgroundColor: 'deepskyblue' } : null"
                        @click="clickedPage(i)"
                        >{{ i }}</a
                    >
                </li>
            </template>
            <li class="page-item" v-if="currentPage != totalPages">
                <a class="page-link" @click="nextPage">Next</a>
            </li>
        </ul>
    </nav>
</template>

<script>
export default {
    props: {
        currentPage: {
            type: Number,
            required: true,
        },
        totalItems: {
            type: Number,
            required: true,
        },
        itemsPerPage: {
            type: Number,
            default: 10,
        },
    },
    computed: {
        totalPages() {
            return Math.ceil(this.totalItems / this.itemsPerPage);
        },
    },
    methods: {
        previousPage() {
            if (this.currentPage > 1) {
                this.$emit('search', this.currentPage - 1);
            }
        },
        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.$emit('search', this.currentPage + 1);
            }
        },
        clickedPage(current) {
            this.$emit('search', current);
        },
    },
};
</script>

<style></style>
