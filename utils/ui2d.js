$(function() {
    function updateNumberOfColors(event, ui) {
        changeNumberOfColors(Math.log2(ui.item.value) + 1);
    }
    $("#colors").selectmenu({change: updateNumberOfColors});
});