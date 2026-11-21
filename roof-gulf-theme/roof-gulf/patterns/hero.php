<?php
/**
 * Title: واجهة رئيسية (Hero)
 * Slug: roof-gulf/hero
 * Categories: roof-gulf, banner
 */
$rg_img = esc_url( get_theme_file_uri( 'assets/images/hero.svg' ) );
?>
<!-- wp:cover {"url":"<?php echo $rg_img; ?>","dimRatio":40,"overlayColor":"primary-dark","isUserOverlayColor":true,"minHeight":760,"contentPosition":"center right","align":"full","className":"rg-hero","style":{"spacing":{"padding":{"top":"var:preset|spacing|70","bottom":"var:preset|spacing|70"},"margin":{"top":"0"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-cover alignfull has-custom-content-position is-position-center-right rg-hero" style="margin-top:0;padding-top:var(--wp--preset--spacing--70);padding-bottom:var(--wp--preset--spacing--70);min-height:760px"><img class="wp-block-cover__image-background" alt="" src="<?php echo $rg_img; ?>" data-object-fit="cover"/><span aria-hidden="true" class="wp-block-cover__background has-primary-dark-background-color has-background-dim-40 has-background-dim"></span><div class="wp-block-cover__inner-container"><!-- wp:group {"align":"wide","layout":{"type":"constrained","contentSize":"680px","justifyContent":"right"}} -->
<div class="wp-block-group alignwide"><!-- wp:paragraph {"className":"rg-eyebrow is-light"} -->
<p class="rg-eyebrow is-light">مقاولات عامة • إنشاءات • تشطيبات</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":1,"style":{"typography":{"lineHeight":"1.3"}},"fontSize":"display"} -->
<h1 class="wp-block-heading has-display-font-size" style="line-height:1.3">نبني <span style="color:#F28C28" class="has-inline-color">الثقة</span> قبل أن نبني المباني</h1>
<!-- /wp:heading -->

<!-- wp:paragraph {"style":{"typography":{"lineHeight":"1.9"},"color":{"text":"#d3dce7"}},"fontSize":"large"} -->
<p class="has-text-color has-large-font-size" style="color:#d3dce7;line-height:1.9">سقف الخليج للمقاولات — شريكك في تنفيذ المشاريع السكنية والتجارية من التصميم حتى التسليم، بجودة عالية والتزام صارم بالوقت والميزانية.</p>
<!-- /wp:paragraph -->

<!-- wp:buttons {"style":{"spacing":{"margin":{"top":"var:preset|spacing|40"}}}} -->
<div class="wp-block-buttons" style="margin-top:var(--wp--preset--spacing--40)"><!-- wp:button -->
<div class="wp-block-button"><a class="wp-block-button__link wp-element-button" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>">اطلب عرض سعر مجاني</a></div>
<!-- /wp:button -->

<!-- wp:button {"className":"is-style-outline"} -->
<div class="wp-block-button is-style-outline"><a class="wp-block-button__link wp-element-button" href="<?php echo esc_url( home_url( '/projects/' ) ); ?>">شاهد مشاريعنا</a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons --></div>
<!-- /wp:group --></div></div>
<!-- /wp:cover -->
