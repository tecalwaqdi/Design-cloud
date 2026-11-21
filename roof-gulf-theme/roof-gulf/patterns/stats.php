<?php
/**
 * Title: أرقام وإنجازات
 * Slug: roof-gulf/stats
 * Categories: roof-gulf
 */
$rg_stats = array(
	array( '+15', 'سنة خبرة' ),
	array( '+250', 'مشروع منجز' ),
	array( '+180', 'عميل راضٍ' ),
	array( '+120', 'مهندس وفني' ),
);
?>
<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|50","bottom":"var:preset|spacing|50"},"margin":{"top":"0"}}},"backgroundColor":"primary","textColor":"base","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull has-base-color has-primary-background-color has-text-color has-background" style="margin-top:0;padding-top:var(--wp--preset--spacing--50);padding-bottom:var(--wp--preset--spacing--50)"><!-- wp:columns {"align":"wide","isStackedOnMobile":false,"style":{"spacing":{"blockGap":{"left":"var:preset|spacing|30"}}},"className":"rg-stats"} -->
<div class="wp-block-columns alignwide is-not-stacked-on-mobile rg-stats"><?php foreach ( $rg_stats as $rg_stat ) : ?><!-- wp:column -->
<div class="wp-block-column"><!-- wp:paragraph {"align":"center","className":"rg-stat-number","fontSize":"xx-large"} -->
<p class="has-text-align-center rg-stat-number has-xx-large-font-size"><?php echo esc_html( $rg_stat[0] ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"align":"center","style":{"color":{"text":"#c9d4e2"},"typography":{"fontWeight":"500"}}} -->
<p class="has-text-align-center has-text-color" style="color:#c9d4e2;font-weight:500"><?php echo esc_html( $rg_stat[1] ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:column --><?php endforeach; ?></div>
<!-- /wp:columns --></div>
<!-- /wp:group -->
