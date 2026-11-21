<?php
/**
 * Title: معلومات التواصل
 * Slug: roof-gulf/contact
 * Categories: roof-gulf, contact
 */
$rg_phone = roof_gulf_contact( 'phone' );
$rg_tel   = preg_replace( '/\s+/', '', $rg_phone );
$rg_mail  = roof_gulf_contact( 'email' );
$rg_cards = array(
	array( 'phone', 'اتصل بنا', '<a href="tel:' . esc_attr( $rg_tel ) . '"><span dir="ltr">' . esc_html( $rg_phone ) . '</span></a>' ),
	array( 'chat', 'واتساب', '<a href="' . esc_url( 'https://wa.me/' . roof_gulf_contact( 'whatsapp' ) ) . '" target="_blank" rel="noopener">راسلنا مباشرة</a>' ),
	array( 'mail', 'البريد الإلكتروني', '<a href="mailto:' . esc_attr( $rg_mail ) . '">' . esc_html( $rg_mail ) . '</a>' ),
	array( 'pin', 'العنوان', esc_html( roof_gulf_contact( 'address' ) ) ),
);
?>
<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|70","bottom":"var:preset|spacing|70"},"margin":{"top":"0"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull" style="margin-top:0;padding-top:var(--wp--preset--spacing--70);padding-bottom:var(--wp--preset--spacing--70)"><!-- wp:group {"layout":{"type":"constrained","contentSize":"640px"}} -->
<div class="wp-block-group"><!-- wp:paragraph {"align":"center","className":"rg-eyebrow"} -->
<p class="has-text-align-center rg-eyebrow">تواصل معنا</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"textAlign":"center","fontSize":"xx-large"} -->
<h2 class="wp-block-heading has-text-align-center has-xx-large-font-size">يسعدنا سماع تفاصيل مشروعك</h2>
<!-- /wp:heading -->

<!-- wp:paragraph {"align":"center","textColor":"muted"} -->
<p class="has-text-align-center has-muted-color has-text-color">فريقنا جاهز للرد على استفساراتك وتحديد موعد معاينة مجانية للموقع. أوقات العمل: الأحد – الخميس، 8 صباحاً – 5 مساءً.</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->

<!-- wp:columns {"align":"wide","className":"rg-cards","style":{"spacing":{"blockGap":{"left":"var:preset|spacing|40"},"margin":{"top":"var:preset|spacing|50"}}}} -->
<div class="wp-block-columns alignwide rg-cards" style="margin-top:var(--wp--preset--spacing--50)"><?php foreach ( $rg_cards as $rg_c ) : ?><!-- wp:column -->
<div class="wp-block-column"><!-- wp:group {"className":"rg-card","style":{"border":{"radius":"16px","width":"1px"},"spacing":{"padding":{"top":"var:preset|spacing|50","bottom":"var:preset|spacing|50","left":"var:preset|spacing|30","right":"var:preset|spacing|30"}}},"borderColor":"line","backgroundColor":"surface","layout":{"type":"constrained"}} -->
<div class="wp-block-group rg-card has-border-color has-line-border-color has-surface-background-color has-background" style="border-width:1px;border-radius:16px;padding-top:var(--wp--preset--spacing--50);padding-right:var(--wp--preset--spacing--30);padding-bottom:var(--wp--preset--spacing--50);padding-left:var(--wp--preset--spacing--30)"><!-- wp:html -->
<div class="rg-icon is-centered"><?php echo roof_gulf_icon( $rg_c[0] ); // phpcs:ignore ?></div>
<!-- /wp:html -->

<!-- wp:heading {"textAlign":"center","level":3} -->
<h3 class="wp-block-heading has-text-align-center"><?php echo esc_html( $rg_c[1] ); ?></h3>
<!-- /wp:heading -->

<!-- wp:paragraph {"align":"center"} -->
<p class="has-text-align-center"><?php echo $rg_c[2]; // phpcs:ignore WordPress.Security.EscapeOutput -- escaped above. ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group --></div>
<!-- /wp:column --><?php endforeach; ?></div>
<!-- /wp:columns -->

<!-- wp:html -->
<div style="margin-top:var(--wp--preset--spacing--50);border-radius:16px;overflow:hidden;box-shadow:var(--wp--preset--shadow--card)" class="alignwide"><iframe title="موقع الشركة على الخريطة" src="https://maps.google.com/maps?q=<?php echo rawurlencode( roof_gulf_contact( 'address' ) ); ?>&amp;z=12&amp;output=embed" width="100%" height="380" style="border:0;display:block" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div>
<!-- /wp:html --></div>
<!-- /wp:group -->
