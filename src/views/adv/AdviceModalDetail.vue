<template><p>안녕하세요</p>
    <div>
        <teleport to="body">
            <div class="backdrop">
                <div class="container" style="width: 500px">
                    <div class="modal-dialog">
                        <div class="modal-content">
                        <div class="modal-header">
                            <p class="conTitle">
                                <span>수강 상담 관리</span>
                            </p>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        </teleport>
    </div>

</template>
<script>

</script>

<style>
.backdrop {
    display: flex;
    position: fixed;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.5);
}
.container {
    background: white;
    padding: 1.5rem;
    height: 70%;
}
</style>
