<?php
/**
 * Title: معرض المشاريع
 * Slug: roof-gulf/projects
 * Categories: roof-gulf, gallery
 */
$rg_projects = array(
	array( 'برج إداري — حي العليا', 'مباني تجارية' ),
	array( 'مجمع فلل سكنية — 24 فيلا', 'مشاريع سكنية' ),
	array( 'ترميم مبنى تراثي', 'ترميم' ),
	array( 'مركز تجاري — الطريق الدائري', 'مباني تجارية' ),
	array( 'مستودعات ومنشآت صناعية', 'منشآت صناعية' ),
	array( 'تشطيب مقر شركة', 'تشطيبات' ),
);
?>
<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|70","bottom":"var:preset|spacing|70"},"margin":{"top":"0"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull" style="margin-top:0;padding-top:var(--wp--preset--spacing--70);padding-bottom:var(--wp--preset--spacing--70)"><!-- wp:group {"align":"wide","layout":{"type":"flex","flexWrap":"wrap","justifyContent":"space-between","verticalAlignment":"bottom"}} -->
<div class="wp-block-group alignwide"><!-- wp:group {"layout":{"type":"default"}} -->
<div class="wp-block-group"><!-- wp:paragraph {"className":"rg-eyebrow"} -->
<p class="rg-eyebrow">أعمالنا</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"fontSize":"xx-large"} -->
<h2 class="wp-block-heading has-xx-large-font-size">مشاريع نفخر بإنجازها</h2>
<!-- /wp:heading --></div>
<!-- /wp:group -->

<!-- wp:buttons -->
<div class="wp-block-buttons"><!-- wp:button {"className":"is-style-outline","textColor":"primary"} -->
<div class="wp-block-button is-style-outline"><a class="wp-block-button__link has-primary-color has-text-color wp-element-button" href="<?php echo esc_url( home_url( '/projects/' ) ); ?>">كل المشاريع</a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons --></div>
<!-- /wp:group -->

<?php foreach ( array_chunk( $rg_projects, 3, true ) as $rg_row ) : ?>
<!-- wp:columns {"align":"wide","style":{"spacing":{"blockGap":{"left":"var:preset|spacing|40"},"margin":{"top":"var:preset|spacing|40"}}}} -->
<div class="wp-block-columns alignwide" style="margin-top:var(--wp--preset--spacing--40)"><?php foreach ( $rg_row as $rg_i => $rg_p ) : $rg_img = esc_url( get_theme_file_uri( 'assets/images/project-' . ( $rg_i + 1 ) . '.svg' ) ); ?><!-- wp:column -->
<div class="wp-block-column"><!-- wp:cover {"url":"<?php echo $rg_img; ?>","dimRatio":0,"customGradient":"linear-gradient(180deg,rgba(8,26,46,0) 40%,rgba(8,26,46,0.9) 100%)","isUserOverlayColor":true,"minHeight":320,"contentPosition":"bottom right","className":"rg-project","style":{"border":{"radius":"14px"}}} -->
<div class="wp-block-cover has-custom-content-position is-position-bottom-right rg-project" style="border-radius:14px;min-height:320px"><img class="wp-block-cover__image-background" alt="" src="<?php echo $rg_img; ?>" data-object-fit="cover"/><span aria-hidden="true" class="wp-block-cover__background has-background-dim-100 has-background-dim has-background-gradient" style="background:linear-gradient(180deg,rgba(8,26,46,0) 40%,rgba(8,26,46,0.9) 100%)"></span><div class="wp-block-cover__inner-container"><!-- wp:paragraph {"style":{"typography":{"fontSize":"0.85rem","fontWeight":"700"},"spacing":{"margin":{"bottom":"0"}}},"textColor":"accent"} -->
<p class="has-accent-color has-text-color" style="margin-bottom:0;font-size:0.85rem;font-weight:700"><?php echo esc_html( $rg_p[1] ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3,"textColor":"base","style":{"spacing":{"margin":{"top":"0.25rem"}}}} -->
<h3 class="wp-block-heading has-base-color has-text-color" style="margin-top:0.25rem"><?php echo esc_html( $rg_p[0] ); ?></h3>
<!-- /wp:heading --></div></div>
<!-- /wp:cover --></div>
<!-- /wp:column --><?php endforeach; ?></div>
<!-- /wp:columns -->
<?php endforeach; ?></div>
<!-- /wp:group -->
